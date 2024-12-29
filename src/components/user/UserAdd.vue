<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { apiGetUser, apiCreateUser, apiEditUser } from './../../API/utils'; 
import dayjs from 'dayjs';

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);

const adminData = ref({
  name: '',
  email: '',
  password: '',
  role: '',
  dob: '',
  profile: null,
  gender: '',
  status: false,
  userGalleries: [],
  userPictures: [],
});

const rules = computed(() => ({
  name: { required },
  email: { required, email },
  password: isEdit.value ? {} : { required },
  role: { required },
  dob: { required },
  profile: isEdit.value ? {} : { required },
  gender: { required },
  status: { required },
  userGalleries: isEdit.value ? {} : { required },
  userPictures: isEdit.value ? {} : { required },
}));

const vv = useVuelidate(rules, adminData);

const roles = ref([{ id: 1, name: 'Admin' },
  { id: 2, name: 'User' },
  { id: 3, name: 'Manager' },
  { id: 4, name: 'Guest' },]);  
const showDatePicker = ref(false);  

console.log('dob.value', adminData.value.dob);
const formattedDate = () => { 
    const parsedDate = dayjs(adminData.value.dob);
  if (parsedDate.isValid()) {
    return parsedDate.format('DD-MM-YY');
  }
  return '';
};
 
const closePopup = (data: string) => {
  router.push({ name: 'UsersList' }); 
}; 
const submit = () => {
  vv.value.$validate();
  if (!vv.value.$error) {
    const data = new FormData();
    data.append('name', adminData.value.name);
    data.append('email', adminData.value.email);
    data.append('role_id', adminData.value.role);
    data.append('dob', adminData.value.dob);
    data.append('gender', adminData.value.gender);
    data.append('status', adminData.value.status ? '1' : '0');

    if (isEdit.value) {
      apiEditUser(route.params.id, data)
        .then(() => router.push({ name: 'UsersList' }))
        .catch((err) => console.error('Error updating user:', err));
    } else {
      data.append('password', adminData.value.password);
      if (adminData.value.profile) data.append('profile', adminData.value.profile);
      adminData.value.userGalleries.forEach((file) => data.append('user_galleries[]', file));
      adminData.value.userPictures.forEach((file) => data.append('user_pictures[]', file));
        console.log("data",data);
        
      apiCreateUser(data)
        .then(() => router.push({ name: 'UsersList' }))
        .catch((err) => console.error('Error creating user:', err));
    }
  }
};

onMounted(() => {
  if (route.params.id) {
    isEdit.value = true;
    apiGetUser(route.params.id)
      .then((res: any) => {
          
          const data = res.data;
          console.log("data",data);
        adminData.value = {
          name: data.name,
          email: data.email,
          password: '',
          role: data.role_id,
          dob: data.dob,
          profile: data.profile,
          gender: data.gender,
          status: data.status === '1',
          userGalleries: data.user_galleries || [],
          userPictures: data.user_pictures || [],
        };
        formattedDate();
      })
      .catch((err: any) => {
        console.error('Error fetching user:', err);
      });
  }
});
</script>

<template>
  <div style="overflow: auto;" class="position-fixed top-0 right-0 left-0 bottom-0 table-container"> 
    <navBar />
    <v-container fluid class="">
      <v-card flat class="fill-height rounded-lg user-form-card m-5 p-5">
        <v-row class="d-flex justify-content-between align-center"> 
          <v-col cols="6" class="ml-2 header-title">
            {{ isEdit ? 'Update Admin User' : 'Create Admin User'}}
          </v-col>
        </v-row>  
        <v-col>
            <v-form>
                <v-row>
                    <v-col cols="6">
                    <v-text-field 
                        label="Name*" 
                        type="text" 
                        v-model="vv.name.$model"
                        variant="underlined" 
                        required
                    ></v-text-field>
                    <div v-if="vv.name.$invalid && vv.name.$dirty" class="text-red-600 mt-1 text-sm"> Name required </div>
                    </v-col>
                    <v-col cols="6">
                    <v-text-field 
                        label="Email" 
                        type="email" 
                        v-model="vv.email.$model"
                        variant="underlined" 
                        required
                    ></v-text-field>
                    <div v-if="vv.email.$invalid && vv.email.$dirty" class="text-red-600 mt-1 text-sm"> Email required </div>
                    </v-col> 
                    <v-col cols="6" v-if="!isEdit">
                        <v-text-field
                            v-model="vv.password.$model"
                            :type="showPassword ? 'text' : 'password'"
                            label="Password*"
                            variant="underlined"
                            required
                            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append="togglePasswordVisibility"
                        ></v-text-field>
                        <div v-if="vv.password.$invalid && vv.password.$dirty" class="text-red-600 mt-1"> Password required </div>
                        </v-col>

                    <v-col cols="6">
                        <v-select
                        label="Role*"
                        v-model="vv.role.$model"
                        :items="roles"
                        item-value="id"
                        item-text="name"
                        variant="underlined"
                        required
                    ></v-select>
                    <div v-if="vv.role.$invalid && vv.role.$dirty" class="text-red-600 mt-1"> Role required </div>
                    </v-col> 
                    <v-col cols="6"> 
                        <input type="date" v-model="adminData.dob" placeholder="Dob*" required @click="showDatePicker = true" /> 
                            
                <div v-if="vv.dob.$invalid && vv.dob.$dirty" class="text-red-600 mt-1"> Dob required </div>
              </v-col>

              <v-dialog v-if="showDatePicker" :persistent="true" max-width="290px">
             
                <input 
                    type="date"
                    v-model="adminData.dob" 
                    placeholder="Dob*" 
                    required 
                    @click="showDatePicker = true"
                />
              </v-dialog>
                    <v-col cols="6">
                        <v-file-input
                        label="Profile*"
                        accept="image/*"
                        @change="handleProfile"
                        multiple
                        variant="underlined"
                        required
                    ></v-file-input>
                </v-col>

                    <v-col cols="6">
                        <v-radio-group label="Gender*" inline v-model="adminData.gender" :rules="[required]">
                            <v-radio label="Female" value="female"></v-radio>
                            <v-radio label="Male" value="male"></v-radio>
                        </v-radio-group>
                        <div v-if="vv.gender.$invalid && vv.gender.$dirty" class="text-red-600 mt-1"> Gender required </div>
                    </v-col>
                    <v-col cols="6">
                        <div class="status">Status*</div>
                        <v-switch label="Active" v-model="adminData.status"></v-switch>
                    <div v-if="vv.status.$invalid && vv.status.$dirty" class="text-red-600 mt-1"> Status required </div>
                    </v-col>

                    <v-col cols="6">
                        <v-file-input
                        label="Gallery*"
                        @change="handlegallery"
                        multiple
                        accept="image/*"
                        variant="underlined"
                        required
                    ></v-file-input>
                </v-col>
                    <v-col cols="6">
                        <v-file-input
                        multiple
                        label="User Pictures*"
                        @change="handlepicture" 
                        accept="image/*"
                        variant="underlined"
                        required
                    ></v-file-input>
                </v-col>
                    <v-col cols="12">
                        <v-btn class="submitBtn text-capitalize mr-4" @click="submit">
                            {{ isEdit ? 'Update' : 'Submit'}}
                        </v-btn>
                        <v-btn class="cancelBtn text-capitalize" @click="closePopup">
                            Cancel
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form> 
        </v-col> 
    </v-card>
  </v-container>
</div>
</template>


<style scoped>
.header-title{
    font-size: 18px !important;
    font-weight: 400;
    letter-spacing: normal !important;
    font-weight: 500;
    margin-bottom: 5px;
}
 .user-form-card{
    padding: 20px;
 }

 :deep(#radio-group-13){
    margin-left: 0;
 }

 .table-container{
    background: #d5e7ec;
 }

 .status{
    color: #837f7fde !important;
 }

 .submitBtn{
    background: #007190;
    color: white;
 }

 .cancelBtn{
    background: #aaaaaa;
    color: white;
 }
::v-deep .v-messages{
    display: none;
 }
 .text-red-600{
    font-size: 12px;
    color: red;
 }
</style>