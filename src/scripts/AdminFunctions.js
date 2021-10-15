import axiosapi from "./../utils/axiosapi"

export const AdminFunctions = {
    getAcademicDivisionsActive: async ()=>{
        return await axiosapi.doGet("/academic/division/get")
    }

    
}