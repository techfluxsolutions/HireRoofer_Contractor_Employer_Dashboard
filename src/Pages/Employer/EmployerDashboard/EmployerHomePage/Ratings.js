import { Star } from "lucide-react";

export const RatingStars = ({ rating = 0, totalRatings = 0 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 mt-2">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={12}
          className="fill-yellow-400 text-yellow-400"
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <Star size={12} className="text-gray-300" />
          <Star
            size={12}
            className="absolute top-0 left-0 fill-yellow-400 text-yellow-400 overflow-hidden"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={12}
          className="text-gray-300"
        />
      ))}

      {/* Rating text */}
      <span className="text-xs text-gray-400 ml-1">
        {totalRatings > 0 ? `(${rating})` : "(No ratings)"}
      </span>
    </div>
  );
};