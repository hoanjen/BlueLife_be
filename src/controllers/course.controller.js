const Course = require('../models/Course.model');
const { createTerm } = require('../controllers/term.controller');
const User = require('../models/User.model');
const IndexToUpdate = require('../models/IndexToUpdate.model');
const Term = require('../models/Term.model');

const createCourse = async (req, res) => {
    try {
        const newCourse = {
            user: req.user._id,
            nameCourse: req.body.name,
            updateIndex: new Date().getTime(),
            access: req.body.access,
            totalTerm: req.body.terms.nameTerm.length
        }

        const course = new Course(newCourse);
        
        await course.save();
        await createTerm(course._id, req.body.terms.nameTerm, req.body.terms.mean);

        res.status(201).send({message: "success"});
    } catch (error) {
        throw new Error(error);
    }
}

const updateIndex = async (req, res) => {
    try {
        if(await IndexToUpdate.findOne({ course: req.body.courseId, user: req.user._id }) ===  null){
            const newIndexToUpdate = new IndexToUpdate({
                course: req.body.courseId,
                user: req.user._id,
                updateIndex: new Date().getTime()
            })
            await newIndexToUpdate.save();
        }
        else{
            await IndexToUpdate.findOneAndUpdate({ course: req.body.courseId, user: req.user._id }, { updateIndex: new Date().getTime() });
        }
        res.status(200).send({ message: "success" });
    } catch (error) {   
        throw new Error(error);
    }

}

const showNewCourse = async (req,res) => {
    try {
        const courseList = await Course.aggregate([
            {
                $lookup:
                {
                    from: 'courses', localField: 'course', foreignField: '_id', as: 'course'
                    , "pipeline": [
                        {
                            $match: { $or: [{ access: 'public' }, { user: req.user._id }] }
                        },
                        {
                            $project: {
                                _id: true,
                                nameCourse: true,
                                updateIndex: true,
                                totalTerm: true,
                                user: true
                            }
                        }]
                }
            },
            { $lookup: 
                { from: 'users', localField: 'user', foreignField: '_id', as: 'users' 
                , "pipeline": [{
                        $project: {
                            user: true,
                            name: true,
                            avatar: true
                        }
                    }]      
                }
            },
            { $match: { access: { $in: ['public'] } }},
            {$sort: { createdAt: -1 }},
            {$limit: 16}
        ])


        res.status(200).send(courseList);


    } catch (error) {
        throw new Error(error);
    }
}

const showRecentCourse = async (req, res) => {
    try {
        
        const recentList = await IndexToUpdate.aggregate([
            { $match: { user: req.user._id } },
            { $sort: { updateIndex: -1 } },
            {
                $lookup:
                {
                    from: 'courses', localField: 'course', foreignField: '_id', as: 'course'
                    , "pipeline": [
                        {
                            $match: { $or: [{ access: 'public' }, { user: req.user._id }] }
                        },
                        {
                        $project: {
                            _id: true,
                            nameCourse: true,
                            updateIndex: true,
                            totalTerm: true,
                            user: true
                        }
                    }]   
                }
            },
            {
                $lookup: {
                    from: 'users', localField: 'user', foreignField: '_id', as: 'user'
                    , "pipeline": [{
                        $project: {
                            user: true,
                            name: true,
                            avatar: true
                        }
                    }]   
                }
            }
        ])

        res.status(200).send(recentList);
    } catch (error) {
        throw new Error(error);
    }
}

const deteleCourse = async (req, res) =>{
    try {
        const check = await Course.deleteOne({user: req.user._id, _id: req.body.delete});
        console.log(check);
        if (check.deletedCount !== 0){
            await Term.deleteMany({ course: req.body.delete});
        }
        else{
            throw new Error('course does not exist');
        }
        res.status(200).send({message: 'success'});
    } catch (error) {
        throw new Error(error);
    }
}


const showTerms = async (req,res) => {
    try {
        const list = await Course.aggregate([
            {$match: {user: req.user._id}},
            {
                $lookup:{
                    from: 'terms', localField: '_id', foreignField: 'course', as: 'terms'
                }
            }
        ])
        res.status(200).send(list);
    } catch (error) {
        throw new Error(error);
    }
    
}

const cloneCourse = async (req,res) => {
    try {
        const cloneCourse = await Course.findById(req.body.id).lean();
        console.log(cloneCourse);
        const newCourse = new Course ({
            user: req.user._id,
            nameCourse: cloneCourse.nameCourse + " clone",
            updateIndex: new Date().getTime(),
            access: cloneCourse.access,
            totalTerm: cloneCourse.totalTerm
        });
        const successCourse = await newCourse.save();
        const listTerm = await Term.find({course: cloneCourse._id}).lean();
        const listPromise = [];
        listTerm.forEach((term) => {
                const newTerm = new Term({
                    course: successCourse._id,
                    nameTerm: term.nameTerm,
                    mean: term.mean
                })
                listPromise.push(newTerm.save());
            }
        )

        await Promise.all(listPromise);
        res.status(200).send({ message: "success" });
    } catch (error) {
        throw new Error(error);
    }
}


module.exports = { createCourse, updateIndex, showNewCourse, showRecentCourse, deteleCourse, showTerms, cloneCourse }