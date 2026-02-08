// ============================
// Select.jsx
const Select = ({ label, placeholder }) => {
    return (
        <div>
            <label className="text-xs text-gray-500">{label}</label>
            <select className="w-full mt-1 border rounded-lg px-3 py-2 text-sm text-gray-400">
                <option>{placeholder}</option>
            </select>
        </div>
    );
};
export default Select;