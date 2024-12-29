<script setup lang="ts">
import navBar from './../navBar.vue';
import { reactive, ref, onMounted, watch,computed  } from 'vue';
import { VPagination } from 'vuetify/components';
import { apiGetUsers, apiDeleteUsers, apiDeleteMultipleUsers } from './../../API/utils';

const loading = ref<boolean>(true);
const search = ref('');  
const activeButton = ref<string>('listing');
const currentPage = ref<number>(1);  // Track current page
const totalData = ref<number>(0);  // Track total number of items
const perPage = ref<number>(10);  // Set number of items per page
import { useRouter } from 'vue-router';
const handlesearch = ref<string>('');
  const handleFilter = ref<string>('');
    const selectedRole = ref<string>('');
      const selectedNames = ref<string>('');
const users = ref<any[]>([]);
  const selectedItems = ref([]);
  const selectedUser = ref([]);
const selectAll = ref<boolean>(false);
  const menuVisible = ref<boolean>(false);
    const VisibilityVal = ref<boolean>(false);
      const dialog = ref(false);
      const selectedOptions = ref([])
const setActive = (data: string) => {
  activeButton.value = data;
};

const router = useRouter()
const getUserData = async () => {
  console.log("fklfld",search.value);
  
  loading.value = true;
  try {
    const res: any = await apiGetUsers({
      page: currentPage.value,
      search: search.value,
      filter: handleFilter.value,
      sort: '',
      order_by: 'asc',
      perPage: perPage.value, // Pass perPage to the API
    });
    users.value = res.data;
    totalData.value = res.total;  // Set total data count
  } finally {
    loading.value = false;
  }
}; 

const headers = ['Name', 'Email', 'Role', 'DOB', 'Gender', 'Status', 'Actions'];

const state = reactive({
  items: [],
  headers: [
    { text: 'Name', align: 'start', value: 'name' },
    { text: 'Email', align: 'start', value: 'email' },
    { text: 'Role', align: 'start', value: 'role' },
    { text: 'DOB', align: 'start', value: 'dob' },
    { text: 'Gender', align: 'start', value: 'gender' },
    { text: 'Status', align: 'start', value: 'status' },
    { text: 'Actions', align: 'start', value: 'actions' },
  ],
});
const paginatedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * perPage.value;
  const endIndex = startIndex + perPage.value;
  return state.items.slice(startIndex, endIndex);
});

const roles = ref(['Admin', 'User', 'Manager', 'Guest']);
const rangeText = computed(() => {
  const start = (currentPage.value - 1) * perPage.value + 1;
  const end = Math.min(currentPage.value * perPage.value, totalData.value);
  return `${start}-${end} of ${totalData.value}`;
});

const totalPages = computed(() => {
  return Math.ceil(totalData.value / perPage.value);
});

watch(search, (newValue, oldValue) => {
    getUserData()
})

watch(users, (newUsers) => {
  state.items = newUsers;
}); 
watch(currentPage, () => {
  toggleSelectAll()
});


const exportToCSV = () => {
    const csvContent = generateCSVContent();
    downloadCSV(csvContent);
  }

  const generateCSVContent = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += "Id,Name,Email,Role,Dob,Gender,Status\n";

    users.value.forEach((user: any) => {
      csvContent += `${user.id},${user.name},${user.email},${user.role.name},${user.dob},${user.gender},${user.status}\n`;
    });

    return encodeURI(csvContent);
  }

  const downloadCSV = (csvContent: string) => {
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const pushPullCheck = (id) => {
    const index = selectedOptions.value.indexOf(id);
    if (index !== -1) {
        selectedOptions.value.splice(index, 1);  
    } else {
        selectedOptions.value.push(id);
    }
};

const toggleSelectAll = () => {
  paginatedItems.value.forEach(item => {
    selectedItems.value[item.id] = selectAll.value;
  });
};

const handleMultipleDelete = async () => {
    let data = new FormData()
    data.append('id[]', selectedOptions.value as any);
    await apiDeleteMultipleUsers(data).then((res:any) => {

    })
}
const viewItem = (item: string) => {
  dialog.value = true
  selectedUser.value = item
};

const editItem = (item: string) => { 
  router.push({ name: 'editUser', params: { id: item.id } }); 
}; 
const deleteItem = async (id: number) => {
    loading.value = true;

    await apiDeleteUsers(id).then((res) => {
        getUserData()
    }).catch((err : any) => {
        loading.value = false;
    })
}
const resetFilter = (data: string) => {
  menuVisible.value = false
};

const closeVisibility = (data: string) => {
  VisibilityVal.value = false
};

const addUser = (data: string) => {
  router.push({ name: 'AddUser' }); 
}; 
const applyFilter = (data: string) => {
  getUserData();
  resetFilter()
};
onMounted(() => {
  getUserData();
});

// Handle page change
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  getUserData();
};
</script>

<template>
  <div> 
    <navBar />
    <v-container fluid class="table-container">
      <v-card class="fill-height no-margin table-card pb-0">
        <v-row class="d-flex justify-content-between align-center mt-2"> 
          <v-col cols="6">
            <span
              @click="setActive('listing')"
              :class="{ 'active-btn': activeButton === 'listing' }"
              class="mx-2 px-4 py-2 cursor-pointer"
            >
              Listing
            </span>
            <span
              @click="setActive('import')"
              :class="{ 'active-btn': activeButton === 'import' }"
              class="mx-2 px-4 py-2 cursor-pointer"
            >
              Import
            </span>
            <span
              @click="setActive('importZip')"
              :class="{ 'active-btn': activeButton === 'importZip' }"
              class="mx-2 px-4 py-2 cursor-pointer"
            >
              Import Zip
            </span>
          </v-col>
        </v-row> 
        <v-row class="d-flex justify-space-between align-center"> 
          <v-col cols="4">
            <v-text-field 
              v-model="search"
              label="Search"
              class="mx-4"
              @change="getUserData"
               prepend-inner-icon="mdi-magnify"
              variant="underlined"
              outlined
            />
          </v-col>
          <v-col cols="auto" class="d-flex justify-end right-icon-div">  
            <v-menu
              v-model="menuVisible"
              transition="scale-transition"
              :close-on-content-click="false"
              :close-on-click="false"
              max-width="500"
            >
              <template v-slot:activator="{ props }"> 
                <div
                  v-bind="props"
                  class="div-filter-eye"
                  v-tooltip="'Filter'"
                >
                  <i class="fa fa-filter"></i>
                </div>
              </template>

              <v-card class="filter-card"> 
                <v-row class="close-icon" @click="resetFilter">
                  
                  <v-icon>mdi-close</v-icon>
                </v-row>
                <v-row class="set-menu-content">

                  <v-select
                    label="Role*"
                    :items="roles"
                    variant="underlined"
                    required 
                    v-model="selectedRole"
                    class="full-width p-0"
                  ></v-select>
            
                  <v-row justify="space-between" class="button-row">
                    <span
                      @click="applyFilter"
                      class="apply-btn"
                    >
                      Apply Filter
                    </span>
                    <span
                      @click="resetFilter"
                      class="reset-btn"
                    >
                      Reset Filter
                    </span>
                  </v-row>
                </v-row>
              </v-card>
            </v-menu>  
            <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <div class="div-plus" @click="addUser" v-bind="props" v-tooltip="'Add'">
                  <i class="fa fa-plus"></i>
                </div>
              </template> 
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <div class="p-0" @click="exportToCSV"  v-bind="props" v-tooltip="'Export'">
                  <img src="/public/image/download.png" alt="" width="20">
                </div>
              </template> 
            </v-tooltip>
          <v-menu
            v-model="VisibilityVal"
            transition="scale-transition"
            :close-on-content-click="false"
            :close-on-click="false"
            max-width="500"
          > 
            <template v-slot:activator="{ props }">
              <div
                v-bind="props"
                class="div-filter-eye"
                v-tooltip="'Columns Visibility'"
              >
                <i class="fa fa-eye"></i>
              </div>
            </template>

            <v-card class="visibility-card">
              <v-row class="close-icon" @click="closeVisibility">
                <v-icon>mdi-close</v-icon>
              </v-row>
              <v-row>
                <p class="visibility-header">Columns</p>
                <hr>
                </v-row>
                <v-row class="content-area">
                <div class="col checkbox-list"
                  v-for="(name, index) in headers"
                  :key="index">
                  <v-checkbox
                    v-model="selectedNames"
                    :label="name"
                    :value="name"
                  ></v-checkbox>
                </div> 
              </v-row>
            </v-card>
          </v-menu> 
            <div @click="handleMultipleDelete" v-if="selectedOptions.length > 1 || selectAll.length > 1" v-tooltip="'Multiple Delete'">
              <i class="fa fa-trash"></i>
            </div>
          </v-col>
        </v-row>
        <v-col>
          <table class="w-100">
          <thead>
            <tr class="header-cell">
              <th>
                <v-checkbox class="d-flex justify-content-center header-checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"  
                />
              </th>
              <th v-for="(data,i) in headers">{{data}}</th> 
            </tr>
          </thead>
          <tbody>
            <tr v-if="!state.items.length">
              <td colspan="8">Loading items...</td>
            </tr>
            <tr v-else v-for="(item, index) in paginatedItems" :key="index">
              <td>
                <v-checkbox class="custom-checkbox d-flex justify-content-center w-25" v-model="selectedItems[item.id]" @click="pushPullCheck(item.id)" />
              </td>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.role.name }}</td>
              <td>{{ item.dob }}</td>
              <td>{{ item.gender_text }}</td>
              <td>{{ item.status_text }}</td>
              <td>
                
                <button @click="viewItem(item)" class="mr-2">
                  <i class="fa fa-eye"></i>
                </button>
                <button @click="editItem(item)" class="mr-2">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button @click="deleteItem(item.id)" class="mr-2">
                  <i class="fa fa-trash"></i>
                </button>
            </td> 
            </tr>
          </tbody>
        </table>
        <v-dialog
          v-model="dialog"
          max-width="400"
          persistent
        > 
          <v-card>
            <v-col class="view-header">
              <p>
                VIEW USER
              </p>
              <v-icon @click="dialog = false">mdi-close</v-icon> 
            </v-col>
            <v-card>
             <table>  
            <tbody> 
             <tr>
              <td>Name:</td>
              <td>{{selectedUser.name}}</td>
             </tr>
             <tr>
              <td>Email:</td>
              <td>{{selectedUser.email}}</td>
             </tr>
             <tr>
              <td>Role:</td>
              <td>{{selectedUser.role.name}}</td>
             </tr>
             <tr>
              <td>Dob:</td>
              <td>{{selectedUser.dob}}</td>
             </tr>
             <tr>
              <td>Profile:</td>
              <td><a :href="selectedUser.profile" target="_blank" rel="noopener noreferrer">View</a></td>
             </tr>
             <tr>
              <td>Gender:</td>
              <td>{{selectedUser.gender_text}}</td>
             </tr>
             <tr>
              <td>Status:</td>
              <td>{{selectedUser.status_text}}</td>
             </tr>
            </tbody>
             </table>
            </v-card>
          </v-card>
        </v-dialog>
        <v-row class="d-flex justify-content-between justify-end align-center footer-items" cols="6"> 
          <span>
            Row per page
          </span>
          <v-col cols="1">
            <v-select
              v-model="perPage"
              cols="1"
              :items="[5, 10, 20, 50, 100]"
              class="col-1 custom-select"
              variant="underlined" 
            />
          </v-col>
          <span>{{ rangeText }}</span>
          <v-pagination
          v-model:page="currentPage"
          :length="Math.ceil(totalData.value / perPage.value)"
          :total-visible="5"
          @update:page="handlePageChange"
        />
        </v-row>
      </v-col> 
    </v-card>
  </v-container>
</div>
</template>


<style scoped>
.table-card{
  padding: 10px 20px;
}
/* Custom checkbox styles */
.custom-checkbox .v-checkbox__input {
  background-color: gray !important; /* Set gray background when unchecked */
  border: 1px solid #cccccc !important; /* Light gray border */
  border-radius: 50% !important; /* Round checkbox */
}

.custom-checkbox .v-checkbox__input:checked {
  background-color: gray !important; /* Gray background when checked */
  border-color: #cccccc !important; /* Light gray border */
}
.div-filter-eye{
  background-color: #3f51b5;
}
.div-plus{
  background-color: #007190;
}
.right-icon-div{
  cursor: pointer;
  padding-right: 28px !important;
  height: 66px;
  gap: 10px;
}
.right-icon-div div{
  border-radius: 5px;
  padding: 10px 15px;
}
.right-icon-div div i{
  color: white;
}
.custom-checkbox .v-checkbox__icon {
  color: white !important; /* White color for checkmark */
}
th {
  border: none !important; /* Remove all borders */
}

table {
  border-radius: 10px !important;
  border-collapse: collapse;
  overflow: hidden;
  width: 100%;
}
table tbody tr:nth-child(odd) {
  background: #f5f5f5;
} 
.header-cell th{
  background: #007190 !important;  
  color: #fff !important;
}
.custom-checkbox{
  margin-left: 35px !important;
}
.header-checkbox{
  margin-left: 40px !important;
}
tbody tr td{ 
  text-align: center;
  height: 48px !important;
  color: #000 !important;
  font-family: Poppins, Helvetica, "sans-serif";
  font-size: 14px;
}
.footer-items{
  font-family: Poppins, Helvetica, "sans-serif" !important;
  font-size: 12px !important;
  color: #007190 !important;
  gap:20px;
}
::v-deep .v-select__selection-text{
  font-size: 12px !important; 
} 
::v-deep .v-input__prepend {
    margin-left: 10px !important;
    position: absolute !important;
}
.v-container{
    background: #d5e7ec !important;
}
.active-btn{
    color: #000;
    border-radius: 10px;
    background: #d5e7ec !important;
    font-weight: 500 !important;
    font-family: Poppins, Helvetica, "sans-serif";
}
.filter-card {
  width: 100%;
  padding: 10px;
  max-width: 500px; 
  position: relative;
  height: 159px !important;
    width: auto;
    overflow: hidden !important;
}

.full-width {
  width: 100%;
}
.close-icon{
  padding: 10px;
    float: right;
    cursor: pointer;
    font-size: 12px; 
}
.set-menu-content{
  padding: 5px;
} 
.reset-btn{
  caret-color: #737373 !important;
  color: #737373 !important;
}
.apply-btn {
  caret-color: #007190 !important;
  color: #007190 !important; /* Lighten color on hover */
}

/* Bottom Buttons in one line */
.button-row {
  margin-top: 25px;
  display: flex;
  font-size: 12px;
  width: 100%;
  padding: 0px 30px;
    font-weight: 500;
    cursor: pointer;
  justify-content: space-between;
}

.v-tooltip__content {
  font-size: 12px;
  padding: 6px;
}
.content-area{
  overflow-y: auto;
  padding-left: 20px;
  display: block;
}
::v-deep .v-card{
  overflow: hidden !important;
}
.visibility-card{
  width: 200px;
  padding: 15px;
  height: 100px;
}
.visibility-header{
  font-size: 16px;
  font-weight: 600;
  padding: 20px 5px;
  width: 100%;
  border-bottom: 1px solid gray;
}
::v-deep .v-input__details{
  display: none !important;
}
.content-area{
  height: 250px;
  overflow-y: scroll;
}
.view-header{
  background-color: #000;
  padding: 25px 20px;
  color: #fff;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}
</style>