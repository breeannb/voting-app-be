// the create route will be used when a new organization is created
// the get all route will be used to see all organizations (_id, title, and imageUrl of organization only)
// the get by id route will be used to get details about an organization
// the update route will be used to update organization information
// the delete route will be used if an organization is disbanded

const mongoose = require('mongoose'); 

const schema = new mongoose.Schema({
  title: {
    type: String, 
    required: true, 
    enum: ['League of Women Voters', 'Environmental Voter Project', 'Them.us'],
    maxlength: 50
  }, 
  description: { 
    type: String, 
    required: true, 
    enum: ['vote for women', 'vote for environment', 'vote for lgbtq+'],
    maxlength: 300
  }, 
  imageUrl: {
    type: String, 
    required: true, 
    enum: ['https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/LWV_Logo.svg/1200px-LWV_Logo.svg.png', 'https://www.environmentalvoter.org/sites/default/files/evp-logo.png', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ftwitter.com%2Fthem&psig=AOvVaw3cdcC4m12L_4TMNnlKt8nZ&ust=1591820986153000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOD6v7bJ9ekCFQAAAAAdAAAAABAH'],
    maxlength: 300
  }

}); 

module.exports = mongoose.model('Organization', schema);
