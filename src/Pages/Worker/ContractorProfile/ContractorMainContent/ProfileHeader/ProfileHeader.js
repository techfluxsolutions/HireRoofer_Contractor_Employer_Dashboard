// ============================
// ProfileHeader.jsx
const ProfileHeader = () => {
    return (
        <div className="flex justify-between items-center bg-gradient-to-r from-[#1747C6] to-[#0B2260CC] rounded-xl px-6 py-4 text-white">
            <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-blue-300 p-2 flex items-center justify-center">
                    <img
                        src="/ProfileImages/dummyMan.png"
                        alt="Profile"
                        className="object-contain"
                    />
                </div>

                <div>
                    <div className="font-semibold ">Johnes Williums</div>
                    <div className="text-xs opacity-80">Contractor</div>
                </div>
            </div>
            <div className="bg-white/20  p-3 rounded-lg text-sm">
                ⭐ 4.5/5 Rating
            </div>
        </div>
    );
};
export default ProfileHeader;


// ============================