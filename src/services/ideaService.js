/**
 * Idea Service
 * Handles all idea-related Firestore operations
 * Encrypts sensitive text fields + teamId (deterministic) in Firestore
 * Supports comments and categories
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
import { encryptFields, decryptFields, encryptText, decryptText, encryptDeterministic, decryptDeterministic } from '../utils/encryption';

// Fields to encrypt (non-deterministic) in idea documents
const ENCRYPTED_IDEA_FIELDS = ['title', 'description', 'creatorName'];

/**
 * Create a new project idea within a team
 */
export const createIdea = async (teamId, ideaData) => {
  try {
    // Encrypt sensitive fields before storing
    const encryptedData = encryptFields(ideaData, ENCRYPTED_IDEA_FIELDS);
    // Encrypt teamId deterministically so queries work
    const encryptedTeamId = encryptDeterministic(teamId);

    const idea = {
      ...encryptedData,
      teamId: encryptedTeamId,
      likes: [],
      likesCount: 0,
      dislikes: [],
      dislikesCount: 0,
      comments: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'ideas'), idea);
    return { idea: { id: docRef.id, ...ideaData, teamId, likes: [], likesCount: 0, dislikes: [], dislikesCount: 0, comments: [] }, error: null };
  } catch (error) {
    return { idea: null, error: error.message };
  }
};

/**
 * Get all ideas for a specific team
 * Uses deterministic encryption so the query matches stored encrypted teamId
 */
export const getTeamIdeas = async (teamId) => {
  try {
    const encryptedTeamId = encryptDeterministic(teamId);
    const q = query(
      collection(db, 'ideas'),
      where('teamId', '==', encryptedTeamId)
    );

    const querySnapshot = await getDocs(q);
    const ideas = [];
    querySnapshot.forEach((docSnap) => {
      const data = decryptFields(docSnap.data(), ENCRYPTED_IDEA_FIELDS);
      data.teamId = teamId; // Restore plain teamId
      // Decrypt comments
      if (data.comments) {
        data.comments = data.comments.map(decryptComment);
      }
      ideas.push({ id: docSnap.id, ...data });
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
      const data = decryptFields(docSnap.data(), ENCRYPTED_IDEA_FIELDS);
      data.teamId = decryptDeterministic(data.teamId);
      // Decrypt comments
      if (data.comments) {
        data.comments = data.comments.map(decryptComment);
      }
      return { idea: { id: docSnap.id, ...data }, error: null };
    }
    return { idea: null, error: 'Idea not found' };
  } catch (error) {
    return { idea: null, error: error.message };
  }
};

/**
 * Toggle like on an idea (like/unlike)
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
      await updateDoc(ideaRef, {
        likes: arrayRemove(userId),
        likesCount: increment(-1),
        updatedAt: serverTimestamp()
      });
      return { liked: false, error: null };
    } else {
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
      await updateDoc(ideaRef, {
        dislikes: arrayRemove(userId),
        dislikesCount: increment(-1),
        updatedAt: serverTimestamp()
      });
      return { disliked: false, error: null };
    } else {
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
 * Encrypt a comment object before storing
 */
const encryptComment = (comment) => ({
  ...comment,
  userName: encryptText(comment.userName),
  text: encryptText(comment.text)
});

/**
 * Decrypt a comment object after reading
 */
const decryptComment = (comment) => ({
  ...comment,
  userName: decryptText(comment.userName),
  text: decryptText(comment.text)
});

/**
 * Add a comment to an idea
 */
export const addComment = async (ideaId, userId, userName, text) => {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    const comment = {
      id: crypto.randomUUID(),
      userId,
      userName,
      text,
      createdAt: new Date().toISOString()
    };

    // Encrypt comment fields before storing
    await updateDoc(ideaRef, {
      comments: arrayUnion(encryptComment(comment)),
      updatedAt: serverTimestamp()
    });

    return { comment, error: null };
  } catch (error) {
    return { comment: null, error: error.message };
  }
};

/**
 * Delete a comment from an idea
 */
export const deleteComment = async (ideaId, comment) => {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);

    // We need to remove the encrypted version of the comment
    // Fetch the idea and find the matching comment by id
    const ideaSnap = await getDoc(ideaRef);
    if (!ideaSnap.exists()) return { error: 'Idea not found' };

    const ideaData = ideaSnap.data();
    const updatedComments = (ideaData.comments || []).filter(c => {
      // Compare by comment id — the id is stored in plain text
      return c.id !== comment.id;
    });

    await updateDoc(ideaRef, {
      comments: updatedComments,
      updatedAt: serverTimestamp()
    });

    return { error: null };
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
