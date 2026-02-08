// Input.jsx
const Input = ({ label, placeholder }) => {
    return (
        <div>
            <label className="text-xs text-gray-500">{label}</label>
            <input
                placeholder={placeholder}
                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            />
        </div>
    );
};
export default Input;