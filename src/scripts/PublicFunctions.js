import app from './../utils/axiosapi'

export const PublicFunctions = {
    doTest: async ()=>{
        return await app.doGet("https://catfact.ninja/fact")
    }
}