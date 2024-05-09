import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as Yup from 'yup';
import API from '../Services/service';

export const useUpdateCoordinateFormik = ({onError, onResponse, condition, data}: {onError?: any, onResponse?: any, condition?: any, data?: any}) => {
    const formik = useFormik<any>({
        initialValues: {
            name_location: '',
            subdistrict: '',
            lat: '',
            long: '',
            link: '',  
            thumbnail: '',  
            condition: [],  
            scale: '', 
            remark: '',
            code: '', 
            pum: '', 
            province: '',
            ward: '', 
            address: '',
            typeArea: '',
            provinceCode: '',
            typeAreaCode: '', 
            subdistrictCode: '', 
            wardCode: '', 
            wide: '', 
            source: '',
        },
        validationSchema: Yup.object({
            name_location: Yup.string()
            .min(6, 'Minimal 6 karakter')
            .required('Tidak boleh kosong!'),
            subdistrict: Yup.string()
            .required('Tidak boleh kosong!'),
            lat: Yup.string()
            .required('Tidak boleh kosong!'),
            long: Yup.string()
            .required('Tidak boleh kosong!'),
            link: Yup.string()
            .required('Tidak boleh kosong!'),
            thumbnail: Yup.string()
            .required('Tidak boleh kosong!'),
            province: Yup.string()
            .required('Tidak boleh kosong!'),
            ward: Yup.string()
            .required('Tidak boleh kosong!'),
            pum: Yup.string()
            .required('Tidak boleh kosong!'),
            provinceCode: Yup.string()
            .required('Tidak boleh kosong!'),
            typeArea: Yup.string()
            .required('Tidak boleh kosong!'),
            typeAreaCode: Yup.string()
            .required('Tidak boleh kosong!'),
            subdistrictCode: Yup.string()
            .required('Tidak boleh kosong!'),
            address: Yup.string()
            .required('Tidak boleh kosong!'),
            source: Yup.string()
            .required('Tidak boleh kosong!'),
            condition: Yup.array()
            .notRequired()
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {

                const newData = {
                    title_id: data.title_id,
                    coordinate_id: data.coordinate_id,
                    name_location: values.name_location,
                    subdistrict: values.subdistrict,
                    lat: values.lat,
                    long: values.long,
                    link: values.link, 
                    thumbnail: values.thumbnail, 
                    condition: condition.length > 0 ? condition : undefined, // Mengirimkan nilai condition hanya jika tidak kosong
                    scale: values.scale, 
                    remark: values.remark,
                    code: values.code, 
                    pum: values.pum, 
                    province: values.province,
                    ward: values.ward, 
                    address: values.address, 
                    provinceCode: values.provinceCode,
                    typeArea: values.typeArea, 
                    typeAreaCode: values.typeAreaCode, 
                    subdistrictCode: values.subdistrictCode, 
                    wardCode: values.wardCode, 
                    wide: values.wide, 
                    source: values.source, 
                }
                const response = await API.updateCoordinate(newData)
                console.log('response update coordinate:', response)

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
            name_location: data && data.name_location ? data.name_location : '',
            subdistrict: data && data.subdistrict ? data.subdistrict : '',
            lat: data && data.lat ? data.lat : '',
            long: data && data.long ? data.long : '',
            link: data && data.link ? data.link : '',  
            thumbnail: data && data.thumbnail ? data.thumbnail : '',  
            note: data && data.note ? data.note : '',  
            condition: data && data.condition ? data.condition : [],  
            scale: data && data.scale ? data.scale : '', 
            address: data && data.address ? data.address : '', 
            remark: data && data.remark ? data.remark : '',
            code: data && data.code ? data.code : '', 
            pum: data && data.pum ? data.pum : '', 
            province: data && data.province ? data.province : '',
            typeArea: data && data.typeArea ? data.typeArea : '', 
            ward: data && data.ward ? data.ward : '', 
            provinceCode: data && data.provinceCode ? data.provinceCode : '',
            typeAreaCode: data && data.typeAreaCode ? data.typeAreaCode : '', 
            subdistrictCode: data && data.subdistrictCode ? data.subdistrictCode : '', 
            wardCode: data && data.wardCode ? data.wardCode : '', 
            wide: data && data.wide ? data.wide : '', 
            source: data && data.source ? data.source : '',
        })
    }, [data])

    return formik
}