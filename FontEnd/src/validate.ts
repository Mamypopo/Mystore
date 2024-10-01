import { defineRule } from 'vee-validate';


defineRule('required',(value: string) => {
    if(value){
        return true
    }

    return'กรุณากรอกข้อมูล'

}); 

defineRule('requiredusernameid',(value: string) => {
    if(value){
        return true
    }

    return'กรุณากรอกไอดีผู้ใช้'

}); 


defineRule('requiredpassword',(value: string) => {
    if(value){
        return true
    }

    return'กรุณากรอกรหัสผ่าน'

}); 


defineRule('requiredusername',(value: string) => {
    if(value){
        return true
    }

    return'กรุณากรอกข้อมูล'

});



defineRule('requiredpass',(value: string) => {
    if(value){
        return true
    }

    return'กรุณากรอกข้อมูล'

});



defineRule('requiredid',(value: string) => {
    if(value){
        return true
    }

    return'กรุณากรอกข้อมูล'

}); 

defineRule('requiredfname',(value: string) => {
    if(value){
        return true
    }

    return'กรุณากรอกข้อมูล'

}); 


defineRule('requiredlname',(value: string) => {
    if(value){
        return true
    }

    return'กรุณากรอกข้อมูล'

}); 

defineRule('requiredfaculty',(value: string) => {
    if(value){
        return true
    }

    return'กรุณากรอกข้อมูล'

}); 

defineRule('requiredbranch',(value: string) => {
    if(value){
        return true
    }

    return'กรุณากรอกข้อมูล'

}); 

defineRule('requiredphone',(value: string) => {
    if(value){
        return true
    }

    return'กรุณากรอกข้อมูล'

}); 