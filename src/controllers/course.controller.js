const Course = require('../models/Course.model');
const { createTerm } = require('../controllers/term.controller');
const User = require('../models/User.model')
const IndexToUpdate = require('../models/IndexToUpdate.model')

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



module.exports = { createCourse, updateIndex, showNewCourse, showRecentCourse }