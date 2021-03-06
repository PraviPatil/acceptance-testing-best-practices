'use strict';

var Yadda = require('yadda');
var expect = require('./common/chai-helpers').expect;
var categoryService = require('./services/category.service');

var English = Yadda.localisation.English;
var Dictionary = Yadda.Dictionary;

var dictionary = new Dictionary()
    .define('list', /([^\u0000]*)/, Yadda.converters.list);

module.exports = English.library(dictionary)

    .when('I create a category called "$categoryName"', function(categoryName, next) {
        var self = this;
        categoryService.createCategory(categoryName)
            .then(function(createdCategory) {
                self.ctx.category = createdCategory;
                next();
            });
    })

    .when('I ask for the category', function(next) {
        var self = this;
        categoryService.getCategory(this.ctx.category.id)
            .then(function(receivedCategory) {
                self.ctx.category = receivedCategory;
                next();
            });
    })

    .then('I should get the category called "$categoryName"', function(categoryName, next) {
        expect(this.ctx.category.name).to.equal(categoryName);
        next();
    })

    .given('a category called "$categoryName"', function(categoryName, next) {
        var self = this;
        categoryService.createCategory(categoryName)
            .then(function(createdCategory) {
                self.ctx.category = createdCategory;
                next();
            });
    })

    .when('I change the category name to "$categoryName"', function(categoryName, next) {
        var self = this;
        this.ctx.category.name = categoryName;
        categoryService.updateCategory(this.ctx.category)
            .then(function(receivedCategory) {
                self.ctx.category = receivedCategory;
                next();
            });
    })

    .when('I delete the category', function(next) {
        categoryService.deleteCategory(this.ctx.category.id)
            .then(function() {
                next();
            });
    })

    .then('the category should not exist', function(next) {
        expect(categoryService.getCategory(this.ctx.category.id))
            .to.eventually.be.rejected;
        next();
    })

    .given('the following categories\n$list', function(categoryNames, next) {
        var self = this;
        categoryService.createCategories(categoryNames)
            .then(function(createdCategories) {
                self.ctx.categories = createdCategories;
                next();
            });
    });
