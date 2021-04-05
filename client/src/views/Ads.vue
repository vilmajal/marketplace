<template>
  <b-container>
    <h1>Till salu</h1>
    <b-col>
      <b-col cols="4">
        <b-form v-on:submit.prevent="search()">
          <b-input-group>
            <b-form-input
              placeholder="Sök annons"
              v-model="searchTerm"
              required
            >
            </b-form-input>
            <b-input-group-append>
              <b-button variant="dark" type="submit">Sök </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form>
      </b-col>
    </b-col>
    <b-row>
      <!-- '../../../' + ad.imagePath " -->
      <b-col>
        <div class="col-sm" v-for="ad in ads" :key="ad.id">
          <b-card border-variant="dark">
            <b-img
              :src="ad.imagePath"
              img-alt="Card image"
              img-left
              contain
              height="200px"
              width="200px"
            />
            <b-card-title> {{ ad.title }} </b-card-title>
            <b-card-sub-title>Pris: {{ ad.price }} </b-card-sub-title>
            <b-card-text>
              {{ ad.info }}
            </b-card-text>
            <b-button
              @click="infoFunc(ad.aID, ad.title, ad.price, ad.info, ad.type, ad.imagePath)"
              variant="dark"
              >Mer info</b-button
            >
          </b-card>
        </div>
      </b-col>
      <b-col v-if="nyaAnnonser !== null" cols="2">
        <h5>Nya annonser uppe!</h5>
        <b-card border variant="dark">
          {{ nyaAnnonser.title }}
          Tryck
          <h1
            @click="
              infoFunc(
                nyaAnnonser.id,
                nyaAnnonser.title,
                nyaAnnonser.price,
                nyaAnnonser.info,
                nyaAnnonser.type,
                nyaAnnonser.imagePath
              )">
            här
          </h1>
          för att se annonsen!
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
const axios = require('axios').default;

export default {
  name: 'Ads',
  components: {},
  data: () => ({
    ads: [],
    searchTerm: '',
    nyaAnnonser: null,
  }),

  methods: {
    infoFunc(id, title, price, info, type, imgP) {
      this.$router.push({
        path: '/infoView',
        query: {
          annonsID: id,
          annonsTitle: title,
          annonsPrice: price,
          annonsInfo: info,
          annonsType: type,
          annonsImg: imgP,
        },
      });
    },
    search() {
      const postData = {
        word: this.searchTerm,
      };
      axios
        .post('/api/searchAd', postData)
        .then((resp) => {
          if (resp.status === 200 && resp.statusText === 'OK') return resp;
          throw new Error('Unexpected failure when listing ads');
        })
        .then((da) => {
          this.ads = da.data.result;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    axios
      .get('/api/getList', axiosConfig)
      .then((resp) => {
        if (resp.status === 200 && resp.statusText === 'OK') return resp;
        throw new Error('Unexpected failure when listing ads');
      })
      .then((da) => {
        console.log('listads', da);
        this.ads = da.data.ads;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  sockets: {
    newAd(data) {
      console.log('new ad: ', data);
      const adObject = {
        adID: data,
      };
      axios
        .post('/api/getAnnons', adObject)
        .then((resp) => {
          if (resp.status === 200 && resp.statusText === 'OK') return resp;
          throw new Error('Unexpected failure when listing ads');
        })
        .then((newAd) => {
          console.log('detta ska vara den nya adden: ', newAd.data.adInfo[0]);
          const [first] = newAd.data.adInfo;
          this.nyaAnnonser = first;
        });
    },
  },
};
</script>
