<template>
  <div class="home">
    <div class="mx-auto form-class" v-if="showForm">
      <h1>Cansu sizi silmiş mi merak ediyorsanız</h1>
      <form @submit.prevent="search" class="mt-3">
        <div class="mb-3">
          <label for="firstName" class="form-label">Adınız:</label>
          <input v-model="searchFirstName" type="text" id="firstName" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Soyadınız:</label>
          <input v-model="searchLastName" type="text" id="lastName" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">Ara</button>
      </form>
    </div>

    <div class="result-card mx-auto" v-if="showResultCard">
      <div v-if="matchingHumanRecords.length > 0" class="mt-4">
        <ul class="list-group">
          <li v-for="(record, index) in matchingHumanRecords" :key="index" class="list-group-item">
            <h1><strong>{{ getRelationText(record.relation) }}</strong></h1>
          </li>
        </ul>
      </div>
      <div v-else class="mt-4">
        <p class="alert alert-warning">No matching human records found.</p>
      </div>
      <button @click="resetForm" class="btn btn-secondary">Yeniden Ara</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios'

export default {
  data() {
    return {
      searchFirstName: '',
      searchLastName: '',
      matchingHumanRecords: [],
      showForm: true,        
      showResultCard: false, 
    };
  },
  computed: {
    ...mapGetters({
      matchingRelation: 'matchingRelation',
      
    }),
  },
  methods: {
    ...mapActions({
      searchHuman: 'searchHuman',
    }),

    capitalizeText(text) {
      return text.charAt(0).toLocaleUpperCase('tr') + text.slice(1).toLocaleLowerCase('tr');
    },

    async search() {
      try {
        const requestData = {
          firstName: this.capitalizeText(this.searchFirstName),
          lastName: this.capitalizeText(this.searchLastName),
        };

        const response = await axios.post('/api/humans/searchHuman', JSON.stringify(requestData), {
          headers: {
            'Content-Type': 'application/json', 
          },
        });

        if (response.data.success) {
          //console.log('Matching human records:', response.data.data);
          this.matchingHumanRecords = response.data.data;
          this.showForm = false;        
          this.showResultCard = true;   
        } else {
          //console.log('No matching human records found');
          this.matchingHumanRecords = [];
          this.showForm = true;         
          this.showResultCard = false;  
        }
      } catch (error) {
        //console.error('Error searching for human records:', error.response.data);
        this.matchingHumanRecords = [];
        this.showForm = true;         
        this.showResultCard = false;  
      }
    },

    resetForm() {
      this.searchFirstName = '';
      this.searchLastName = '';
      this.matchingHumanRecords = [];
      this.showForm = true;
      this.showResultCard = false;
    },

    getRelationText(relation) {
      if (relation === 'sildi') {
        return 'Malesef silinmişsin, ağlayarak günlüğüne yazabilirsin';
      } else if (relation === 'silmedi') {
        return 'Seni şanslı araba, silmemiş';
      } else {
        return 'Unknown Relation';
      }
    },
  },
 
};
</script>

<style scoped>
.form-class, .result-card{
  width: 50%;
  margin-top: 10%;
}

.btn{
  margin-top: 10px;
}
</style>
