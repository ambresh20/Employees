import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: 'HR',
    gender: 'Male',
    course: [],
    imageFile: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const designationOptions = ['HR', 'Manager', 'Software Developer', 'Web Developer']; 
  const courseOptions = ['MCA', 'BCA', 'BSC', 'B.Tech'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    
    setFormData(prevState => ({
      ...prevState,
      course: checked 
        ? [...prevState.course, value]
        : prevState.course.filter(course => course !== value)
    }));
    
    // Clear error when selecting
    if (errors.course) {
      setErrors({ ...errors, course: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors({
          ...errors,
          imageFile: 'Only JPG and PNG files are allowed'
        });
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      setFormData({
        ...formData,
        imageFile: file
      });
      
      // Clear error
      if (errors.imageFile) {
        setErrors({ ...errors, imageFile: '' });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d+$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must contain only digits';
    }
    
    // Course validation
    if (formData.course.length === 0) {
      newErrors.course = 'At least one course must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      
      // Create form data for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('mobile', formData.mobile);
      submitData.append('designation', formData.designation);
      submitData.append('gender', formData.gender);
      formData.course.forEach(course => {
        submitData.append('course', course);
      });
      
      if (formData.imageFile) {
        submitData.append('image', formData.imageFile);
      }
      
      // Check for email duplication
    //   const checkEmailResponse = await axios.post(
    //     'http://localhost:5000/api/employees/check-email',
    //     { email: formData.email },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`
    //       }
    //     }
    //   );
      
    //   if (checkEmailResponse.data.exists) {
    //     setErrors({
    //       ...errors,
    //       email: 'Email already exists'
    //     });
    //     setIsSubmitting(false);
    //     return;
    //   }
      
      // Submit form
      await axios.post('http://localhost:5000/api/employees', submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Redirect to employee list
      navigate('/employees');
    } catch (err) {
      console.error('Error creating employee:', err);
      
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert('Failed to create employee');
      }
      
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Create Employee</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile No
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <select
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {designationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1">Gender</span>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="male" className="ml-2 block text-sm text-gray-700">
                  Male
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="female" className="ml-2 block text-sm text-gray-700">
                  Female
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1">Course</span>
            <div className="flex flex-wrap gap-4">
              {courseOptions.map(option => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`course-${option}`}
                    name="course"
                    value={option}
                    checked={formData.course.includes(option)}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`course-${option}`} className="ml-2 block text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {errors.course && (
              <p className="text-red-500 text-sm mt-1">{errors.course}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image Upload
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.imageFile ? 'border-red-500' : 'border-gray-300'}`}
            />
            <p className="text-xs text-gray-500 mt-1">Only JPG and PNG files are allowed</p>
            {errors.imageFile && (
              <p className="text-red-500 text-sm mt-1">{errors.imageFile}</p>
            )}
            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>

        </div>

      </form>
    </div>
  );
};

export default CreateEmployee;
