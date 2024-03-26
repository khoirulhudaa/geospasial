import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as Yup from 'yup';
import API from '../Services/service';

export const useUpdateTitleFormik = ({onError, onResponse, data}: {onError?: any, onResponse?: any, data?: any}) => {
    const formik = useFormik<any>({
        initialValues: {
            title: '',
            description: '',
            year: '',
            status: '',
            category: ''
        },
        validationSchema: Yup.object({
            title: Yup.string()
            .min(6, 'Minimal 6 karakter')
            .required('Tidak boleh kosong!'),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {

                const dataNew = {
                    title_id: data?.title_id,
                    title: values.title,
                    description: values.description,
                    year: values.year,
                    type: 'public',
                    status: values.status,
                    category: values.category
                }

                console.log('new data update title :', dataNew)
                
                const response = await API.updateTitle(dataNew)
                console.log(response)
                
                if(response.data.status === 200) {  
                    onResponse(response.data.status)
                    resetForm()
                }else {
                    onError(response.data.message)
                }
            } catch (error: any) {
                onError(error.message)
            }
        }
    })

    useEffect(() => {
        formik.setValues({
            title: data ? data.title : '',
            description: data ? data.description : '',
            year: data ? data.year : '',
            status: data ? data.status : '',
            category: data ? data.category : '',  
        })
    }, [data])

    return formik
}