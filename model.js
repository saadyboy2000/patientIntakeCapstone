const mongoose = require('mongoose');

// this is our schema to represent a restaurant
const formSchema = mongoose.Schema({
  doctor: {type: String, required: true},
  specialty: {type: String, required: true},
  //age: {type: String, required: true},
  id: {type: Number, required: true},
  questions: [String]

},{
  collection: 'forms'
});

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the address object
// we're storing in Mongo.

/*formSchema.virtual('doctorString').get(function() {
  return `${this.doctor} ${this.address.specialty}`.trim()});
  can create virtual if you need it
*/

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
/*formSchema.methods.apiRepr = function() {

  return {
    doctor: this.doctor,
    specialty: this.specialty,
    id: this.id,
    questions: this.questions
  };
}
*/
// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Forms = mongoose.model('Forms', formSchema);

module.exports = {Forms};
//create different model files for formSchema and patientSchema or put them all in this file (different is more organized)