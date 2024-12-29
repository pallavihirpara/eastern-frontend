<script setup lang="ts">
import { ref } from 'vue'
//@ts-ignore
import { login } from './../services/auth';
//@ts-ignore
import { useVuelidate } from '@vuelidate/core';
//@ts-ignore
import { required, email } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const Router = useRouter() 

const adminCredentials = ref<{ email: string; password: string; }>({
    email: '',
    password: ''
})

const rules = {
    email: { required, email },
    password: { required }
}
const vv = useVuelidate(rules, adminCredentials.value)

const submit = () => {
    vv.value.$validate()
    if(!vv.value.$error){
    login(adminCredentials.value).then((res : any)=>{
        if(res.data.status == '1'){
            notify('success', 'Login successful')
            setTimeout(() => {
                localStorage.setItem('user', res.data.name)
                localStorage.setItem('token', res.data.authorization)
                Router.push('/users')
                vv.value.$reset()
            }, 1000);
        }
    }).catch((err : any)=>{
        notify('error','Invalid credentials')
    })
    }
}

const notify = (toastType : any, msg : string) => {
      toast(msg , {
        type : toastType,
        autoClose: 1500,
      });
}

</script>

<template>
  <v-container fluid class="fill-height no-padding">
    <v-row class="fill-height no-margin"> 
      <v-col
        cols="12"
        class="d-flex flex-column justify-center align-start left-panel"
      >
        <div class="content-wrapper">
          <img src="/public/image/logo.png" alt="" width="150" srcset="">
          <div class="text-h6 mb-6">
            Welcome to Eastern Techno Solutions!
          </div>
          <div class="mt-auto text-caption">
            © 2024 Eastern Techno Solutions
          </div>
        </div>
      </v-col>
 
      <div class="right-panel d-flex justify-center align-center">
        <v-form ref="form" class="login-form w-lg-50 w-100 text-center">
          <h3 class="text-h5 font-weight-bold mb-2">Sign In</h3>
          <p class="text-subtitle-2 mb-6 text-grey-600">
            Enter your username and password
          </p>
 
          <v-text-field
            v-model="vv.email.$model"
            label="Email"
            type="email" 
            variant="underlined"
            required
          ></v-text-field>
 
          <v-text-field
            v-model="vv.password.$model"
            type="password"
            label="Password"
            variant="underlined"
            required
          ></v-text-field>
 
          <v-row class="justify-end">
            <span class="text-blue-600 cursor-pointer text-caption">
              Forgot Password?
            </span> 
          </v-row>
 
          <v-btn
            class="bg-blue-600 text-white mt-6"
            large
            block
            @click="submit"
          >
            Submit
          </v-btn>
        </v-form>
      </div>
    </v-row>
  </v-container>
</template>

<style scoped> 
.fill-height {
  height: 100vh;
}
h3{
  font-weight: 500 !important;
    line-height: 11px;
    margin-bottom: 8px !important;
}
p{
  margin-bottom: 16px !important;
  color: #8daab3 !important;
  line-height: 1.5;
  font-size: 13px !important;
  font-weight: 400;
}
div,p,h3,button{
  font-family: Poppins, Helvetica, "sans-serif";
} 
.no-padding {
  padding: 0;
}

.no-margin {
  margin: 0;
}
 
.left-panel {
  background: url(/public/image/login-bg.jpg) no-repeat center center;
  background-size: cover;
  position: relative;
  width: 100%;
  height: 100vh;
  color: white;
}

.content-wrapper {
  padding-left: 3rem;
  max-width: 400px;
}

.right-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 65%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.2);
  z-index: 10;
}
button{
  background:#007190 !important;
  color: #fff;
  border-radius: 4px;
}
span{
  color: #007190 !important;
  font-size: 13px;
  font-family: Poppins, Helvetica, "sans-serif";
}

@media (max-width: 1200px) {
  .right-panel {
    width: 50%;
  }
}
 
@media (max-width: 768px) {
  .left-panel {
    height: auto;
    background-size: cover;
  }
  .right-panel {
    width: 100%; 
    position: relative;
    height: auto; 
    box-shadow: none;
  }

  .content-wrapper {
    padding-left: 1rem;
  } 
}
</style>
