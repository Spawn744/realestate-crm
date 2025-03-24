import * as yup from 'yup';

const propertySchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  price: yup
    .number()
    .required('Price is required')
    .min(1000, 'Price must be at least $1,000')
    .typeError('Must be a valid number'),
  location: yup.string().required('Location is required'),
  status: yup
    .string()
    .oneOf(['available', 'pending', 'sold'], 'Invalid status')
    .required('Status is required'),
  description: yup.string().max(500, 'Description too long')
});

export default propertySchema;