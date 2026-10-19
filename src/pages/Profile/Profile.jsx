import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
// import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: 'https://www.w3schools.com/howto/img_avatar.png',
    bio: '',
    location: '',
    joinedDate: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              name: currentUser.displayName || userData.name || 'No Name',
              email: currentUser.email,
              avatar: userData.avatar || 'https://www.w3schools.com/howto/img_avatar.png',
              bio: userData.bio || 'No bio available',
              location: userData.location || 'Location not set',
              joinedDate: new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (!auth.currentUser) {
    return <div className="profile-container">Please login to view profile</div>;
  }

  return (
    <div className="profile-container shadow">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={user.avatar} alt={user.name} />
        </div>
        <h1>{user.name}</h1>
        <p className="bio">{user.bio}</p>
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <span className="label">Email:</span>
          <span className="value">{user.email}</span>
        </div>
        <div className="detail-item">
          <span className="label">Location:</span>
          <span className="value">{user.location}</span>
        </div>
        <div className="detail-item">
          <span className="label">Member since:</span>
          <span className="value">{user.joinedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;