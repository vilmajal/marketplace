<template>
  <b-container>
    <h1>Välkommen {{ name }}</h1>

    <b-tabs vertical>
      <b-tab title='Min sida' active>
        Här ser du den information du har sparat hos oss och har möjlighet att
        uppdatera den!
        <b-form v-on:submit.prevent='uppdateraInfo()'>
          <b-form-group
            id='emailInputGroup'
            label='Din e-postadress: '
            label-for='emailInput'
          >
            <b-form-input id='emailInput' v-model='email' type='email' required>
            </b-form-input>
          </b-form-group>

          <b-form-group
            id='telephoneInputGroup'
            label='Ditt telefonnummer: '
            label-for='telInput'
          >
            <b-form-input id='telInput' v-model='telephone' type='tel' required>
            </b-form-input>
          </b-form-group>
          <b-button type='submit' variant='dark'>Uppdatera</b-button>
        </b-form>
      </b-tab>
      <b-tab @click='getMethod()' title='Mina annonser'>
        <div class='col-sm' v-for='ad in ads' :key='ad.id'>
          <b-card border-variant='dark'>
            <b-img
              :src='ad.imagePath'
              img-alt='Card image'
              img-left
              contain
              height='200px'
              width='200px'
            />
            <b-card-title> {{ ad.title }} </b-card-title>
            <b-card-sub-title> {{ ad.price }} </b-card-sub-title>
            <b-card-text>
              {{ ad.info }}
            </b-card-text>
          </b-card>
        </div>
      </b-tab>

      <b-tab title='Skapa ny annons'>
        <b-form
          v-on:submit.prevent='createAnnons()'
          enctype='multipart/form-data'
        >
          <h2>Här skapar du en ny annons! Samtliga fält är obligatoriska.</h2>

          Titel. Beskriv produkten korfattat.
          <b-form-input
            v-on:input="draftFunc()"
            v-model='nyAnnons.title'
            id='inline-form-input-name'
            class='mb-2 mr-sm-2 mb-sm-0'
            placeholder='Ex: en fin liten fisk'
            name='title'
            required
          ></b-form-input>

          Välj Kategori:
          <b-form-select
            v-on:input="draftFunc()"
            v-model='nyAnnons.type'
            id='inline-form-custom-select-pref'
            class='mb-2 mr-sm-2 mb-sm-0'
            :options='[
              { text: "Kategori...", value: null },
              "Inredning",
              "Fritid",
              "Sport",
            ]'
            :value='null'
            name='type'
            required
          ></b-form-select>
          <br />
          Välj priset på produkten/tjänsten:
          <b-form-input
            v-on:input="draftFunc()"
            v-model='nyAnnons.price'
            id='inline-form-input-name'
            class='mb-2 mr-sm-2 mb-sm-0'
            placeholder='XXX kr'
            name='price'
            required
          ></b-form-input>
          Information om produkten:
          <b-form-textarea
            v-on:input="draftFunc()"
            v-model='nyAnnons.info'
            id='textarea-large'
            size='lg'
            placeholder='write here'
            name='info'
            required
          ></b-form-textarea>
          Ladda upp bild på varan:
          <b-form-file accept='image/*' v-model='formImg' required />
          <b-button variant='dark' type='submit'>Skapa annons </b-button>
          <b-alert v-model='acceptedAnnons' variant='success'
            >Din nya annons är skapad!</b-alert
          >
        </b-form>
        <!-- uID, title, info, price, type -->
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
const axios = require('axios').default;

export default {
  name: 'Profile',
  data: () => ({
    name: '',
    email: '',
    telephone: '',
    ads: '',
    userID: null,
    acceptedAnnons: false,
    nyAnnons: {
      title: null,
      info: null,
      price: null,
      type: null,
    },
    formImg: null,
  }),
  created() {
    axios
      .get('/api/profileInfo')
      .then((resp) => {
        if (resp.status === 200 && resp.statusText === 'OK') return resp;
        throw new Error('Unexpected failure when listing timeslots');
      })
      .then((brr) => {
        this.name = brr.data.name;
        this.email = brr.data.info.email;
        this.telephone = brr.data.info.telephone;
        this.userID = brr.data.info.userID;
      })
      .then(() => {
        const standardID = { fisk: this.userID };
        axios.post('/api/checkDraft', standardID).then((data) => {
          if (data.data.length > 0) {
            console.log('finns draft');
            console.log(data.data);
            const [first] = data.data;
            console.log('title', first.title);
            this.nyAnnons.title = first.title;
            this.nyAnnons.info = first.info;
            this.nyAnnons.price = first.price;
            this.nyAnnons.type = first.type;
          } else {
            console.log('creating draft');
            axios.post('/api/createDraft', standardID);
          }
        });
      });

    axios
      .get('/api/userAds') // Hämta bara annonser från denna användare
      .then((resp) => {
        if (resp.status === 200 && resp.statusText === 'OK') return resp;
        throw new Error('Unexpected failure when listing timeslots');
      })
      .then((brr) => {
        this.ads = brr.data.ads;
      });
  },
  methods: {
    draftFunc() {
      const updateAd = { draftAd: this.nyAnnons, userID: this.userID };
      axios
        .post('/api/draftAd', updateAd)
        .then(console.log('Saved in draftTable'));
    },
    getMethod() {
      axios
        .get('/api/userAds') // Hämta bara annonser från denna användare
        .then((resp) => {
          if (resp.status === 200 && resp.statusText === 'OK') {
            this.ads = resp.data.ads;
          } else {
            console.log('hehe fail');
          }
        })
        .catch(() => {
          this.$router.push({
            path: 'login',
            query: {
              sessionKilled: true,
            },
          });
        });
    },

    createAnnons() {
      const formData = new FormData();
      formData.append('formImg', this.formImg);
      formData.append('title', this.nyAnnons.title);
      formData.append('type', this.nyAnnons.type);
      formData.append('price', this.nyAnnons.price);
      formData.append('info', this.nyAnnons.info);

      axios
        .post('/api/newAnnons', formData)
        .then((resp) => {
          if (resp.ok) return resp;
          return 'error';
        })
        .then(() => {
          const fiskID = { theID: this.userID };
          axios
            .post('/api/deleteDraft', fiskID);
        });
      this.nyAnnons = {
        title: null,
        info: null,
        price: null,
        type: null,
      };
      this.acceptedAnnons = true;
      setTimeout(() => {
        this.acceptedAnnons = false;
      }, 2000);
    },
    uppdateraInfo() {
      const postData = {
        mail: this.email,
        tele: this.telephone,
      };

      axios
        .post('/api/updateUser', postData)
        .then((resp) => {
          if (resp.status === 200 && resp.statusText === 'OK') return resp;
          return 'error';
        })
        .then((brr) => {
          this.name = brr.data.name;
          this.email = brr.data.info.email;
          this.telephone = brr.data.info.telephone;
        });
    },
  },
};
</script>
