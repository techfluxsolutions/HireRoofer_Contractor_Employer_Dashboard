// ============================
// Gallery.jsx

import GalleryItem from "./GalleryItem/GalleryItem";


const Gallery = () => {
    return (
        <section className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4">My Gallery</h3>
            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => <GalleryItem key={i} />)}
            </div>
        </section>
    );
};
export default Gallery;