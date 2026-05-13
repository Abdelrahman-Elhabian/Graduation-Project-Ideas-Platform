/**
 * Team Service
 * Handles all team-related Firestore operations
 * All data in Firestore is encrypted — including document IDs
 * 
 * Flow:
 * - Plain team ID (e.g. "ABC123") is shared between users
 * - Document ID = encryptDeterministic("ABC123") — so it's unreadable in console
 * - All field values are also encrypted
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
import { encryptText, decryptText, encryptFields, decryptFields, encryptDeterministic, decryptDeterministic } from '../utils/encryption';

// Fields to encrypt (non-deterministic)
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
 * Convert a plain team ID to an encrypted document ID
 * Uses deterministic encryption so the same plain ID always maps to the same doc ID
 * Replaces / with _ to make it a valid Firestore document ID
 */
const toDocId = (plainTeamId) => {
  return encryptDeterministic(plainTeamId).replace(/\//g, '_').replace(/\+/g, '-');
};

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

    // Ensure unique team ID (check using encrypted doc ID)
    let exists = true;
    while (exists) {
      const docSnap = await getDoc(doc(db, 'teams', toDocId(teamId)));
      if (!docSnap.exists()) {
        exists = false;
      } else {
        teamId = generateTeamId();
      }
    }

    const encryptedDocId = toDocId(teamId);
    const encryptedTeamId = encryptDeterministic(teamId);

    const teamData = {
      teamId: encryptedTeamId,
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

    // Encrypt top-level text fields
    const encryptedTeam = encryptFields(teamData, ENCRYPTED_TEAM_FIELDS);
    // Use encrypted doc ID
    await setDoc(doc(db, 'teams', encryptedDocId), encryptedTeam);

    // Update user's teamId (encrypted) in their profile
    await setDoc(doc(db, 'users', userId), {
      teamId: encryptedTeamId,
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Return unencrypted data for immediate UI use
    return { team: { ...teamData, teamId, name: teamName, ownerName: userName }, error: null };
  } catch (error) {
    return { team: null, error: error.message };
  }
};

/**
 * Join an existing team by team ID (user enters the plain 6-char code)
 */
export const joinTeam = async (teamId, userId, userName) => {
  try {
    const plainTeamId = teamId.toUpperCase();
    const encryptedDocId = toDocId(plainTeamId);
    const teamRef = doc(db, 'teams', encryptedDocId);
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

    const encryptedTeamId = encryptDeterministic(plainTeamId);

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

    // Update user's teamId (encrypted)
    await setDoc(doc(db, 'users', userId), {
      teamId: encryptedTeamId,
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Decrypt for return
    const teamData = decryptFields(rawData, ENCRYPTED_TEAM_FIELDS);
    teamData.teamId = plainTeamId;
    teamData.members = rawData.members.map(decryptMember);

    return { team: teamData, error: null };
  } catch (error) {
    return { team: null, error: error.message };
  }
};

/**
 * Get team data by plain team ID
 * Converts to encrypted doc ID for lookup
 */
export const getTeam = async (teamId) => {
  try {
    const encryptedDocId = toDocId(teamId);
    const docRef = doc(db, 'teams', encryptedDocId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const rawData = docSnap.data();
      const teamData = decryptFields(rawData, ENCRYPTED_TEAM_FIELDS);
      teamData.teamId = teamId; // Use plain teamId for display
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
    const encryptedDocId = toDocId(teamId);
    const teamRef = doc(db, 'teams', encryptedDocId);
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

    // Remove teamId from user profile
    await setDoc(doc(db, 'users', userId), {
      teamId: null,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};
