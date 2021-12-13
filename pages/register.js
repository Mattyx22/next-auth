import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axios from 'axios'
import { useRouter } from 'next/router'




const register = () => {

    const router = useRouter()

    const initialValues = {
        email: '',
        username: '',
        password: '',
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().required("No login"),
        username: Yup.string().required("No username"),
        password: Yup.string().required("No password"),
    });

    const onSubmit = (form) => {
        axios.post('/api/register', form).then((response)=> {
            router.push('/')
        })
    }
    
    
    return (
        <>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form>
                    <ErrorMessage name="email" component="span" /><br/>
                    <label>Email:</label><br/>
                    <Field type="email" name="email" /><br/>
                    <ErrorMessage name="username" component="span" /><br/>
                    <label>Username:</label><br/>
                    <Field type="text" name="username" /><br/>
                    <ErrorMessage name="password" component="span" /><br/>
                    <label>Password:</label><br/>
                    <Field type="password" name="password" /> <br/><br/>
                    <button type="submit">Sign Up</button>
                </Form>
            </Formik>
        </>
    )
}

export default register
