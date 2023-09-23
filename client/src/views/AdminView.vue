<template>
  <div class="admin-page">
    <div class="page-card mx-auto">
      <button @click="isAddNewFormVisible = true" class="btn btn-primary rounded-pill"
        v-if="!isAddNewFormVisible && !isUpdateFormVisible && !deleteHuman" >Kişi Ekle</button>
      <div class="add-new mx-auto" v-if="isAddNewFormVisible && !isUpdateFormVisible">
        <h2>Add New Human</h2>
        <form @submit.prevent="addNewHuman">
          <div class="mb-3">
            <label for="newFirstName" class="form-label">First Name:</label>
            <input v-model="capitalizedNewFirstName" type="text" id="newFirstName" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="newLastName" class="form-label">Last Name:</label>
            <input v-model="capitalizedNewLastName" type="text" id="newLastName" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="newRelation" class="form-label">Relation:</label>
            <select v-model="newRelation" id="newRelation" class="form-select" required>
              <option value="sildi">SİL GİTSİN</option>
              <option value="silmedi">SİLME</option>
            </select>
          </div>
          <div class="buttons">
            <button type="submit" class="btn btn-primary rounded-pill">Ekle</button>
            <button @click="closeForm" class="btn btn-secondary rounded-pill">Kapat</button>
          </div>
        </form>
      </div>

      <div class="list-group list-of-humans mx-auto" v-if="!isAddNewFormVisible && !deleteHuman && !isUpdateFormVisible">
        <h2>Listedeki Kişiler</h2>
        <ul>
          <li class="list-group-item" v-for="(human, index) in humans" :key="index">
            <p><strong>ADI:</strong>{{ human.firstName }}</p>
            <hr>
            <p><strong>SOYADI:</strong>{{ human.lastName }}</p>
            <hr>
            <p><strong>SİLDİN Mİ:</strong>{{ human.relation }}</p>
            <div class="buttons">
              <button @click="openUpdateForm(human)" class="btn btn-primary rounded-pill">Güncelle</button>
              <button @click="deleteHuman = human" class="btn btn-danger rounded-pill">Sil</button>
            </div>
          </li>
        </ul>
      </div>

      <div class="update-card mx-auto" v-if="isUpdateFormVisible">
        <h2>Update Human</h2>
        <form @submit.prevent="updateHumanRecord">
          <div class="mb-3">
            <label for="updateFirstName" class="form-label">First Name:</label>
            <input v-model="capitalizedUpdateFirstName" type="text" id="updateFirstName" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="updateLastName" class="form-label">Last Name:</label>
            <input v-model="capitalizedUpdateLastName" type="text" id="updateLastName" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="updateRelation" class="form-label">Relation:</label>
            <select v-model="updateHumanData.relation" id="updateRelation" class="form-select" required>
              <option value="sildi">SİL GİTSİN</option>
              <option value="silmedi">SİLME</option>
            </select>
          </div>
          <div class="buttons">
            <button type="submit" class="btn btn-primary rounded-pill">Güncelle</button>
            <button @click="cancelUpdate" class="btn btn-secondary rounded-pill">İptal</button>
          </div>
        </form>
      </div>

      <div class="delete-card mx-auto" v-if="deleteHuman">
        <h2>Delete Human</h2>
        <p> <strong>{{ deleteHuman.firstName }} {{ deleteHuman.lastName }}</strong> kişisini silmek istiyor musun?</p>
        <div class="buttons">
          <button @click="confirmDelete" class="btn btn-danger rounded-pill">Evet</button>
          <button @click="cancelDelete" class="btn btn-secondary rounded-pill">Hayır</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['humans', 'user']),
    capitalizedNewFirstName: {
      get() {
        return this.newFirstName;
      },
      set(value) {
        this.newFirstName = this.capitalizeText(value);
      },
    },
    capitalizedNewLastName: {
      get() {
        return this.newLastName;
      },
      set(value) {
        this.newLastName = this.capitalizeText(value);
      },
    },
    capitalizedUpdateFirstName: {
      get() {
        return this.updateHumanData.newFirstName;
      },
      set(value) {
        this.updateHumanData.newFirstName = this.capitalizeText(value);
      },
    },
    capitalizedUpdateLastName: {
      get() {
        return this.updateHumanData.newLastName;
      },
      set(value) {
        this.updateHumanData.newLastName = this.capitalizeText(value);
      },
    },
  },
  data() {
    return {
      newFirstName: '',
      newLastName: '',
      newRelation: '',
      isAddNewFormVisible: false,
      isUpdateFormVisible: false,
      humans: [],
      updateHuman: null,
      deleteHuman: null,
      updateHumanData: {
        firstName: '',
        lastName: '',
        newFirstName: '',
        newLastName: '',
        relation: '',
      },
    };
  },
  methods: {
    capitalizeText(text) {
      return text.charAt(0).toLocaleUpperCase('tr') + text.slice(1).toLocaleLowerCase('tr');
    },
    async addNewHuman() {
      try {
        const exists = this.humans.some((human) => {
          return human.firstName === this.newFirstName && human.lastName === this.newLastName;
        });

        if (exists) {
          //console.log('Human already exists in the list.');
          return;
        }

        const response = await axios.post('/api/users/setRelation', {
          firstName: this.newFirstName,
          lastName: this.newLastName,
          relation: this.newRelation,
        });

        console.log(response);

        this.newFirstName = '';
        this.newLastName = '';
        this.newRelation = '';
        this.getHumans();
        this.isAddNewFormVisible = false;
      } catch (error) {
        console.error('Error setting relation:', error.response.data);
      }
    },
    closeForm() {
      this.newFirstName = '';
      this.newLastName = '';
      this.newRelation = '';
      this.isAddNewFormVisible = false;
    },
    async getHumans() {
      try {
        const response = await axios.get('/api/users/getHumans');

        //console.log('Human records:', response.data.data);

        this.humans = response.data.data;
      } catch (error) {
        console.error('Error getting human records:', error.response.data);
      }
    },
    confirmDelete() {
      if (this.deleteHuman) {
        const { firstName, lastName } = this.deleteHuman;

        
        axios.delete('/api/users/deleteHuman', {
          data: { firstName, lastName },
        })
          .then(() => {
           //console.log('Human deleted successfully:', response.data);
            this.deleteHuman = null; 
            this.getHumans(); 
          })
          .catch((error) => {
            console.error('Error deleting human:', error.response.data);
          });
      }
    },
    async updateHumanRecord() {
      if (this.updateHumanData) {
        const { firstName, lastName, newFirstName, newLastName, relation } = this.updateHumanData;

        try {
          const response = await axios.put('/api/users/updateRelation', {
            firstName,
            lastName,
            newFirstName,
            newLastName,
            relation,
          });

          console.log('Response from update API:', response);

          if (response && response.data) {
            //console.log('Human record updated successfully:', response.data);
            
            this.updateHumanData.newFirstName = '';
            this.updateHumanData.newLastName = '';
            this.updateHumanData.relation = '';
            this.getHumans();
            this.isUpdateFormVisible= false;
          } else {
            console.error('Invalid response from the update API:', response);
          }
        } catch (error) {
          console.error('Error updating human record:', error);
        }
      }
    },
    openUpdateForm(human) {
      if (human) {
        this.updateHuman = human;
        this.updateHumanData.firstName = human.firstName;
        this.updateHumanData.lastName = human.lastName;
        this.updateHumanData.newFirstName = human.firstName;
        this.updateHumanData.newLastName = human.lastName;
        this.updateHumanData.relation = human.relation;
        this.isUpdateFormVisible = true;
      }
    },
    cancelUpdate() {
      this.updateHuman = null;
      this.isUpdateFormVisible = false;
    },
    cancelDelete() {
      this.deleteHuman = null;
    },
  },
  created() {
    this.getHumans();
  },
};
</script>

<style scoped>
.btn {
  width: 100px;
}

.page-card {
  margin-top: 100px;
  width: 80%;
}
.list-of-humans{
  margin-top: 30px;
}

.delete-card p {
  margin-top: 50px;
  font-size: 20px;
}
.add-new button {
  margin: 5px;
}

.buttons button{
 margin: 5px;
}


@media only screen and (min-width:1233px) {
  .page-card, .update-card{
    margin-top: 100px;
    width: 50%;
  }
}

</style>
