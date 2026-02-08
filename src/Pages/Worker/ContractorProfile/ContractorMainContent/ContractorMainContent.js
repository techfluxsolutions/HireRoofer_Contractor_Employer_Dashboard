import React from 'react'
import ProfileHeader from './ProfileHeader/ProfileHeader';
import EditProfileForm from './EditProfileForm/EditProfileForm';
import Gallery from './Gallery/Galleray';

const ContractorMainContent = () => {
    return (
        <main className="flex-1 space-y-4">
            <ProfileHeader />
            <EditProfileForm />
            <Gallery />
        </main>
    );
}

export default ContractorMainContent