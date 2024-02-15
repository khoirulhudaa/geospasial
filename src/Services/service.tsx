import api from './axios';

const API = {

    // Account user
    checkAccount: (body: any) => {
        return api.post('/account/signin', body)
    },
    createAccount: (body: any) => {
        return api.post('/account/signup', body)
    },
    updateProfile: (body: any) => {
        return api.post('/account/user', body)
    },
    
    // Dinas
    addDinas: (body: any) => {
        return api.post('/dinas', body)
    },
    getAllDinas: () => {
        return api.get('/dinas')
    },
    removeDinas: (dinas_id: string) => {
        return api.post(`/dinas/${dinas_id}`)
    },
    updateDinas: (body: any) => {
        return api.post('/dinas/update', body)
    },
    
    // Title
    addTitle: (body: any) => {
        return api.post('/title', body)
    },
    getAllTitle: () => {
        return api.get('/title')
    },
    removeTitle: (title_id: string) => {
        return api.post(`/title/${title_id}`)
    },
    
    // Subdistrict
    addSubdistrict: (body: any) => {
        return api.post('/subdistrict', body)
    },
    getAllSubdistrict: () => {
        return api.get('/subdistrict')
    },
    removeSubdistrict: (subdistrict_id: string) => {
        return api.post(`/subdistrict/${subdistrict_id}`)
    },
    updateSubdistrict: (body: any) => {
        return api.post('/subdistrict/update', body)
    },
    
    // Coordinate
    addCoordinate: (body: any) => {
        return api.post('/coordinate', body)
    },
    removeCoordinate: (body: any) => {
        return api.post('/coordinate/remove', body)
    },
    updateCoordinate: (body: any) => {
        return api.post('/coordinate/update', body)
    }
}

export default API;