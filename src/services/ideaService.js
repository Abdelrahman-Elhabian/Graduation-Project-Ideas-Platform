/**
 * Idea Service
 * Handles all idea-related Firestore operations
 * Encrypts sensitive text fields before writing to Firestore
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { encryptFields, decryptFields } from '../utils/encryption';

// Fields to encrypt in idea documents
const ENCRYPTED_IDEA_FIELDS = ['title', 'description', 'creatorName'];

/**
 * Create a new project idea within a team
 */
export const createIdea = async (teamId, ideaData) => {
  try {
    // Encrypt sensitive fields before storing
    const encryptedData = encryptFields(ideaData, ENCRYPTED_IDEA_FIELDS);

    const idea = {
      ...encryptedData,
      teamId,
      likes: [],
      likesCount: 0,
      dislikes: [],
      dislikesCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'ideas'), idea);
    // Return original (unencrypted) data for immediate UI use
    return { idea: { id: docRef.id, ...ideaData, teamId, likes: [], likesCount: 0, dislikes: [], dislikesCount: 0 }, error: null };
  } catch (error) {
    return { idea: null, error: error.message };
  }
};

/**
 * Get all ideas for a specific team
 * NOTE: We query without orderBy to avoid requiring a Firestore composite index.
 * Sorting is done client-side instead.
 */
export const getTeamIdeas = async (teamId) => {
  try {
    const q = query(
      collection(db, 'ideas'),
      where('teamId', '==', teamId)
    );

    const querySnapshot = await getDocs(q);
    const ideas = [];
    querySnapshot.forEach((doc) => {
      // Decrypt sensitive fields after reading
      const data = decryptFields(doc.data(), ENCRYPTED_IDEA_FIELDS);
      ideas.push({ id: doc.id, ...data });
    });

    // Sort by createdAt descending (newest first) on client side
    ideas.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });

    return { ideas, error: null };
  } catch (error) {
    return { ideas: [], error: error.message };
  }
};

/**
 * Get a single idea by ID
 */
export const getIdea = async (ideaId) => {
  try {
    const docRef = doc(db, 'ideas', ideaId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // Decrypt sensitive fields
      const data = decryptFields(docSnap.data(), ENCRYPTED_IDEA_FIELDS);
      return { idea: { id: docSnap.id, ...data }, error: null };
    }
    return { idea: null, error: 'Idea not found' };
  } catch (error) {
    return { idea: null, error: error.message };
  }
};

/**
 * Toggle like on an idea (like/unlike)
 * Ensures one like per user per idea
 * If user has disliked, removes the dislike first
 */
export const toggleLikeIdea = async (ideaId, userId) => {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    const ideaSnap = await getDoc(ideaRef);

    if (!ideaSnap.exists()) {
      return { error: 'Idea not found' };
    }

    const ideaData = ideaSnap.data();
    const hasLiked = ideaData.likes?.includes(userId);
    const hasDisliked = ideaData.dislikes?.includes(userId);

    if (hasLiked) {
      // Remove like
      await updateDoc(ideaRef, {
        likes: arrayRemove(userId),
        likesCount: increment(-1),
        updatedAt: serverTimestamp()
      });
      return { liked: false, error: null };
    } else {
      // Add like, and remove dislike if exists
      const updates = {
        likes: arrayUnion(userId),
        likesCount: increment(1),
        updatedAt: serverTimestamp()
      };
      if (hasDisliked) {
        updates.dislikes = arrayRemove(userId);
        updates.dislikesCount = increment(-1);
      }
      await updateDoc(ideaRef, updates);
      return { liked: true, error: null };
    }
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Toggle dislike on an idea (dislike/undislike)
 * Ensures one dislike per user per idea
 * If user has liked, removes the like first
 */
export const toggleDislikeIdea = async (ideaId, userId) => {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    const ideaSnap = await getDoc(ideaRef);

    if (!ideaSnap.exists()) {
      return { error: 'Idea not found' };
    }

    const ideaData = ideaSnap.data();
    const hasDisliked = ideaData.dislikes?.includes(userId);
    const hasLiked = ideaData.likes?.includes(userId);

    if (hasDisliked) {
      // Remove dislike
      await updateDoc(ideaRef, {
        dislikes: arrayRemove(userId),
        dislikesCount: increment(-1),
        updatedAt: serverTimestamp()
      });
      return { disliked: false, error: null };
    } else {
      // Add dislike, and remove like if exists
      const updates = {
        dislikes: arrayUnion(userId),
        dislikesCount: increment(1),
        updatedAt: serverTimestamp()
      };
      if (hasLiked) {
        updates.likes = arrayRemove(userId);
        updates.likesCount = increment(-1);
      }
      await updateDoc(ideaRef, updates);
      return { disliked: true, error: null };
    }
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Delete an idea
 */
export const deleteIdea = async (ideaId) => {
  try {
    await deleteDoc(doc(db, 'ideas', ideaId));
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Update an idea
 */
export const updateIdea = async (ideaId, updates) => {
  try {
    // Encrypt any sensitive fields in the update
    const encryptedUpdates = encryptFields(updates, ENCRYPTED_IDEA_FIELDS);
    const ideaRef = doc(db, 'ideas', ideaId);
    await updateDoc(ideaRef, {
      ...encryptedUpdates,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};
