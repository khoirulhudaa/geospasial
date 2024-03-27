import React, { useState } from 'react'
import { popUpProps } from '../Models/componentInterface'
import { useTitleFormik } from '../Validations/titleValidation'
import InputField from './InputField'
import ErrorMessage from './errorMessage'

const PopupTitleGeospasial: React.FC<popUpProps> = ({
    handleAlert,
    close,
    dinasID,
    dinasNAME,
    handleStatus
}) => {

    const [error, setError] = useState<string>('')

    const handleErrorMessage = (error: string) => {
        setError(error)
    }

    const handleResponse = (response: number) => {
        if(response === 200) {
            handleStatus()
            handleAlert()
        }
    }

    const titleFormik = useTitleFormik({
        onError: handleErrorMessage,
        onResponse: handleResponse,
        dinasID,
        dinasNAME
    })

  return (
    <div className='w-screen h-screen fixed left-0 top-0 flex justify-center items-center z-[999999] bg-slate-700    bg-opacity-[0.7]'>
        <form onSubmit={titleFormik.handleSubmit} className='w-[600px] h-max rounded-[20px] bg-white p-7 border border-slate-300'>
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
                    value={titleFormik.values.title}
                    onChange={titleFormik.handleChange}
                    onBlur={titleFormik.handleBlur}
                    onError={titleFormik.errors.title}
                    onTouched={titleFormik.touched.title}
                />
            </div>
            <div className='mb-5'>
                <InputField 
                    label='Tahun'
                    name='year'
                    id='year'
                    value={titleFormik.values.year}
                    onChange={titleFormik.handleChange}
                    onBlur={titleFormik.handleBlur}
                    onError={titleFormik.errors.year}
                    onTouched={titleFormik.touched.year}
                />
            </div>
            <div className='w-full flex border-y border-y-slate-600 items-center mb-5 pt-4 pb-8'>
                <div className='w-full'>
                    <label htmlFor="status" className='text-[14px] font-bold text-slate-800'>Status Data</label>
                    <div role="group" id='status' aria-labelledby="my-radio-group" className="w-max mt-5 flex items-center space-x-2">
                        <label className="inline-flex items-center">
                            <input type="radio" name="status" value="Sementara" onChange={(e: any) => titleFormik.setFieldValue('status', e.target.value)} className="form-radio h-6 w-6"/>
                            <span className="ml-2">Sementara</span>
                        </label>
                        <div className='w-[20px]'></div>
                        <label className="inline-flex items-center">
                            <input type="radio" name="status" value="Tetap" onChange={(e: any) => titleFormik.setFieldValue('status', e.target.value)} className="form-radio h-6 w-6"/>
                            <span className="ml-2">Tetap</span>
                        </label>
                    </div>
                </div>
                <div className='w-full'>
                    <label htmlFor="status" className='text-[14px] font-bold text-slate-800'>Status Data</label>
                    <div className='w-[90%] bg-white  oerflow-hidden rounded-full border-slate-500 border outline-0 h-[43px] relative top-3 px-3'>
                        <select name="category" onChange={titleFormik.handleChange} onBlur={titleFormik.handleBlur} id="category" className='bg-white rounded-full w-full border-0 outline-0 h-full'>
                            <option value="" disabled={true}>Pilih Kategori</option>
                            <option value="Koordinat">Titik Koordinat</option>
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
                    value={titleFormik.values.description}
                    onChange={titleFormik.handleChange}
                    onBlur={titleFormik.handleBlur}
                    onError={titleFormik.errors.description}
                    onTouched={titleFormik.touched.description}
                />
            </div>
            <div className='w-max flex items-center'>
                <button type='submit' className='w-max mt-5 hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-slate-700     text-white'>
                    <p>
                        Tambah judul
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

export default PopupTitleGeospasial
