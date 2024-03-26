import React, { useState } from 'react'
import { popUpProps } from '../Models/componentInterface'
import { useUpdateTitleFormik } from '../Validations/updateTitleValidation'
import InputField from './InputField'
import ErrorMessage from './errorMessage'
import SweetAlert from './SweetAlert'

const PopupUpdateTitleGeospasial: React.FC<popUpProps> = ({
    close,
    data,
    handleStatus
}) => {

    const [error, setError] = useState<string>('')

    const handleErrorMessage = (error: string) => {
        setError(error)
    }

    const handleResponse = (response: number) => {
        if(response === 200) {
            handleStatus()
            SweetAlert({
                title: 'Berhasil Perbarui Judul',
                icon: 'success',
                showCancelButton: false
            })
        }
    }

    const updateTitleFormik = useUpdateTitleFormik({
        onError: handleErrorMessage,
        onResponse: handleResponse,
        data
    })

  return (
    <div className='w-screen h-screen fixed left-0 top-0 flex justify-center items-center z-[999999] bg-slate-700    bg-opacity-[0.7]'>
        <form onSubmit={updateTitleFormik.handleSubmit} className='w-[600px] h-max rounded-[20px] bg-white p-7 border border-slate-300'>
            {
                error !== '' ? (
                    <ErrorMessage error={error} />
                ):
                    null
            }
            <div className='mb-5'>
                <InputField 
                    label='Judul data geospasial'
                    name='title'
                    id='title'
                    value={updateTitleFormik.values.title}
                    onChange={updateTitleFormik.handleChange}
                    onBlur={updateTitleFormik.handleBlur}
                    onError={updateTitleFormik.errors.title}
                    onTouched={updateTitleFormik.touched.title}
                />
            </div>
            <div className='mb-5'>
                <InputField 
                    label='Tahun'
                    name='year'
                    id='year'
                    value={updateTitleFormik.values.year}
                    onChange={updateTitleFormik.handleChange}
                    onBlur={updateTitleFormik.handleBlur}
                    onError={updateTitleFormik.errors.year}
                    onTouched={updateTitleFormik.touched.year}
                />
            </div>
            <div className='w-full flex border-y border-y-slate-600 items-center mb-5 pt-4 pb-8'>
                <div className='w-full'>
                    <label htmlFor="status" className='text-[14px] font-bold text-slate-800'>Status Data</label>
                    <div role="group" id='status' aria-labelledby="my-radio-group" className="w-max mt-5 flex items-center space-x-2">
                        <label className="inline-flex items-center">
                            <input type="radio" name="status" value="Sementara" checked={updateTitleFormik.values.status === 'Sementara'} onChange={(e: any) => updateTitleFormik.setFieldValue('status', e.target.value)} className="form-radio h-6 w-6"/>
                            <span className="ml-2">Sementara</span>
                        </label>
                        <div className='w-[20px]'></div>
                        <label className="inline-flex items-center">
                            <input type="radio" name="status" value="Tetap" checked={updateTitleFormik.values.status === 'Tetap'} onChange={(e: any) => updateTitleFormik.setFieldValue('status', e.target.value)} className="form-radio h-6 w-6"/>
                            <span className="ml-2">Tetap</span>
                        </label>
                    </div>
                </div>
                <div className='w-full'>
                    <label htmlFor="status" className='text-[14px] font-bold text-slate-800'>Status Data</label>
                    <div className='w-[90%] bg-white  oerflow-hidden rounded-full border-slate-500 border outline-0 h-[43px] relative top-3 px-3'>
                        <select name="category" value={updateTitleFormik.values.category} onChange={updateTitleFormik.handleChange} onBlur={updateTitleFormik.handleBlur} id="category" className='bg-white rounded-full w-full border-0 outline-0 h-full'>
                            <option value="" disabled={true}>Pilih Kategori</option>
                            <option value="Titik Koordinat">Titik Koordinat</option>
                            <option value="Polygon">Polygon</option>
                            <option value="Gabungan">Gabungan</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='mb-5'>
                <InputField 
                    label='Deskripsi Singkat'
                    name='description'
                    id='description'
                    value={updateTitleFormik.values.description}
                    onChange={updateTitleFormik.handleChange}
                    onBlur={updateTitleFormik.handleBlur}
                    onError={updateTitleFormik.errors.description}
                    onTouched={updateTitleFormik.touched.description}
                />
            </div>
            <div className='w-max flex items-center'>
                <button type='submit' className='w-max mt-5 hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-slate-700     text-white'>
                    <p>
                        Perbarui judul
                    </p>
                </button>
                <button onClick={close} className='w-max ml-4 mt-5 hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-white border border-black text-black'>
                    <p>
                        Batalkan
                    </p>
                </button>
            </div>
        </form>
    </div>
  )
}

export default PopupUpdateTitleGeospasial
