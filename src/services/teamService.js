/**
 * Team Service
 * Handles all team-related Firestore operations
 * Encrypts sensitive text fields in Firestore
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { encryptText, decryptText, encryptFields, decryptFields } from '../utils/encryption';

// Fields to encrypt in team documents
const ENCRYPTED_TEAM_FIELDS = ['name', 'ownerName'];

/**
 * Encrypt a member object's displayName
 */
const encryptMember = (member) => ({
  ...member,
  displayName: encryptText(member.displayName)
});

/**
 * Decrypt a member object's displayName
 */
const decryptMember = (member) => ({
  ...member,
  displayName: decryptText(member.displayName)
});

/**
 * Generate a unique team ID (6 characters, alphanumeric)
 */
const generateTeamId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Create a new team
 */
export const createTeam = async (teamName, userId, userName) => {
  try {
    let teamId = generateTeamId();

    // Ensure unique team ID
    let exists = true;
    while (exists) {
      const docSnap = await getDoc(doc(db, 'teams', teamId));
      if (!docSnap.exists()) {
        exists = false;
      } else {
        teamId = generateTeamId();
      }
    }

    const teamData = {
      teamId,
      name: teamName,
      ownerId: userId,
      ownerName: userName,
      members: [
        encryptMember({
          uid: userId,
          displayName: userName,
          role: 'owner',
          joinedAt: new Date().toISOString()
        })
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Encrypt top-level fields
    const encryptedTeam = encryptFields(teamData, ENCRYPTED_TEAM_FIELDS);
    await setDoc(doc(db, 'teams', teamId), encryptedTeam);

    // Update user's teamId in their profile (merge to create if missing)
    await setDoc(doc(db, 'users', userId), {
      teamId,
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Return unencrypted data for immediate UI use
    return { team: { ...teamData, teamId }, error: null };
  } catch (error) {
    return { team: null, error: error.message };
  }
};

/**
 * Join an existing team by team ID
 */
export const joinTeam = async (teamId, userId, userName) => {
  try {
    const teamRef = doc(db, 'teams', teamId.toUpperCase());
    const teamSnap = await getDoc(teamRef);

    if (!teamSnap.exists()) {
      return { team: null, error: 'Team not found. Please check the Team ID.' };
    }

    const rawData = teamSnap.data();

    // Check if user is already a member
    const isMember = rawData.members.some(member => member.uid === userId);
    if (isMember) {
      return { team: null, error: 'You are already a member of this team.' };
    }

    // Add user to team members (encrypt displayName)
    await updateDoc(teamRef, {
      members: arrayUnion(encryptMember({
        uid: userId,
        displayName: userName,
        role: 'member',
        joinedAt: new Date().toISOString()
      })),
      updatedAt: serverTimestamp()
    });

    // Update user's teamId (merge to create if missing)
    await setDoc(doc(db, 'users', userId), {
      teamId: teamId.toUpperCase(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Decrypt for return
    const teamData = decryptFields(rawData, ENCRYPTED_TEAM_FIELDS);
    teamData.members = rawData.members.map(decryptMember);

    return { team: { ...teamData, teamId: teamId.toUpperCase() }, error: null };
  } catch (error) {
    return { team: null, error: error.message };
  }
};

/**
 * Get team data by team ID (decrypts encrypted fields)
 */
export const getTeam = async (teamId) => {
  try {
    const docRef = doc(db, 'teams', teamId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const rawData = docSnap.data();
      // Decrypt top-level fields
      const teamData = decryptFields(rawData, ENCRYPTED_TEAM_FIELDS);
      // Decrypt member names
      teamData.members = (rawData.members || []).map(decryptMember);
      return { team: teamData, error: null };
    }
    return { team: null, error: 'Team not found' };
  } catch (error) {
    return { team: null, error: error.message };
  }
};

/**
 * Leave a team
 */
export const leaveTeam = async (teamId, userId) => {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamSnap = await getDoc(teamRef);

    if (!teamSnap.exists()) {
      return { error: 'Team not found' };
    }

    const teamData = teamSnap.data();
    const updatedMembers = teamData.members.filter(m => m.uid !== userId);

    await updateDoc(teamRef, {
      members: updatedMembers,
      updatedAt: serverTimestamp()
    });

    // Remove teamId from user profile (merge to create if missing)
    await setDoc(doc(db, 'users', userId), {
      teamId: null,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};
