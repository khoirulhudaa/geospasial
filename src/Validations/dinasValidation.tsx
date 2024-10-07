import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../Services/service';
import store from '../Store/store';

export const useDinasFormik = ({onError, onResponse}: {onError?: any, onResponse?: any}) => {
    
    const auth = store.getState()?.Auth?.auth
    console.log(auth)
   
    const formik = useFormik<any>({
        initialValues: {
            name_dinas: '',
            abbreviation: ''
        },
        validationSchema: Yup.object({
            name_dinas: Yup.string()
            .required('Tidak boleh kosong!'),
            abbreviation: Yup.string()
            .required('Tidak boleh kosong!'),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {
                const value = {
                    name_dinas: values.name_dinas,
                    abbreviation: values.abbreviation,
                    email: auth?.email,
                    user_id: auth?.user_id
                }
                const response = await API.addDinas(value)
                console.log('res', response)
                if(response.data.status === 200) {  
                    onResponse(response.data.status)
                    resetForm()
                }else {
                    onError(response.data.message)
                    resetForm()
                }
            } catch (error: any) {
                onError(error.message)
                resetForm()
            }
        }
    })

    return formik
}