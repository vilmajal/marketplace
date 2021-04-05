<template>
  <div>
    <b-card no-body style="text-center">
      <b-card-body>
        <b-img :src="this.annons.annonsImg" img-alt="Card image" />
        <b-card-title>{{
          this.annons ? this.annons.annonsTitle : "Loading"
        }}</b-card-title>
        <b-card-sub-title class="mb-2"
          >Pris: {{ this.annons.annonsPrice }} kr</b-card-sub-title
        >
        <b-card-text>
          {{ this.annons.annonsInfo }}
        </b-card-text>

        <b-card-text v-if="this.annonsContactInfo !== null">
          Kontakt info:
          <br>
          {{ this.annonsContactInfo.email }}
          Phone:
          <br>
          {{this.annonsContactInfo.telephone}}
        </b-card-text>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
const axios = require('axios').default;

export default {
  name: 'Ads',
  components: {},
  data: () => ({
    adID: null,
    annons: null,
    annonsContactInfo: null,
  }),
  created() {
    const { query } = this.$route;
    this.annons = {
      annonsID: query.annonsID,
      annonsTitle: query.annonsTitle,
      annonsPrice: query.annonsPrice,
      annonsInfo: query.annonsInfo,
      annonsType: query.annonsType,
      annonsImg: query.annonsImg,
    };
    const aID = {
      adsID: query.annonsID,
    };
    axios.post('api/getContactInfo', aID).then((da) => {
      console.log('Här ska datan komma: ', da.data);
      const [first] = da.data.contactInfo;
      console.log('annonsContact: ', first);
      this.annonsContactInfo = first;
    });

    // const axiosConfig = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };
    // axios
    //   .get("/api/getAnnons",{
    //     params: {
    //       annonsID: this.adID}
    //     },
    //     axiosConfig)
    //   .then((resp) => {
    //      console.log('respdatainfo ', resp.data.info[0])
    //      this.annons = resp.data.info[0];
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  },
};
</script>
