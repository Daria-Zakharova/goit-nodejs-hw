const HttpError = require("../utils/http-error");
const controllerWrap = require("../utils/controller-wrap");
const Contact = require("../models/contact");

const getContactsList = async (req, res) => {
    const {_id: owner} = req.user;
    const {page = 1, limit = 20, favorite = false} = req.query;
    const skip = (page - 1) * limit;
    const query = {owner};
    favorite && (query.favorite = true);
    res.json(await Contact.find(query, "", {skip, limit}).populate("owner", "email"));
}

const getContact = async (req, res) => {
    const {contactId} = req.params;
    const result = await Contact.findById(contactId);
    if(!result) {
        throw HttpError({status: 404});
    }
    res.json(result);
}

const addContact = async (req, res) => {
    const {_id: owner} = req.user;
    console.log(req.user, "owner");
    const result = await Contact.create({...req.body, owner});
    res.status(201).json(result);
}

const deleteContact = async (req, res) => {
    const {contactId} = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
      throw HttpError({status: 404});
    }
    res.json({ message: "contact deleted" });
}

const updateContact = async (req, res) => {
    const {contactId} = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw HttpError({status: 404});
    }
    res.json(result);
}

const updateFavorite = async (req, res) => {
    if (!Object.keys(req.body).length) {
        throw HttpError({status: 400, message: "missing field favorite"})
    }
    const {contactId} = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw HttpError({status: 404});
    }
    res.json(result);
};

module.exports = {
    getContactsList: controllerWrap(getContactsList), 
    getContact: controllerWrap(getContact), 
    addContact: controllerWrap(addContact), 
    updateContact: controllerWrap(updateContact), 
    deleteContact: controllerWrap(deleteContact),
    updateFavorite: controllerWrap(updateFavorite),
};