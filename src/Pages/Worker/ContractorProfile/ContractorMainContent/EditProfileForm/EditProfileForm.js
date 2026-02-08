// ============================
// EditProfileForm.jsx
import Input from "./Input";
import Select from "./Select";


const EditProfileForm = () => {
return (
<section className="bg-white rounded-xl p-6 shadow-sm">
<h3 className="font-semibold mb-4">Edit Profile</h3>


<div className="grid grid-cols-2 gap-4">
<Input label="First Name" placeholder="Mr. Enter First Name" />
<Select label="Experience" placeholder="Select Duration" />
<Input label="Last Name" placeholder="Enter Last Name" />
<Select label="Tools" placeholder="Add Tools" />
<div className="col-span-2">
<Select label="Skills" placeholder="Add Skills" />
</div>
</div>


<div className="flex justify-end mt-4">
<button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm">
Save Details
</button>
</div>
</section>
);
};
export default EditProfileForm;


// ============================