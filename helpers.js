function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
class Helpers {
  constructor(lat, long) {
    this.lat = lat;
    this.long = long;
  }


  getDistanceFromLatLonInKm(lat2, lon2) {
    console.log(this.lat,this.long, lat2, lon2)
    var R = 6371; // Radius of the earth in km
    // var R = 3958.756; // Radius of the earth in mi
    var dLat = deg2rad(lat2 - this.lat); // deg2rad below
    var dLon = deg2rad(lon2 - this.long);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(this.lat)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }
}

module.exports = Helpers;
