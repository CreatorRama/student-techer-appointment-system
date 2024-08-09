const mongoose=require('mongoose')

const Replies=require('../Models/Replies.cjs')
const Teacher=require('../Models/Teacher.cjs')

exports.setreply=async(req,res)=>{
    try{
        const {teacherId,studentName,sendAt,time,content}=req.body
        const reply=new Replies({teacherId,studentName,sendAt,time,content})
        await reply.save();
        res.status(201).json({message:"Reply Sent Succesfully",reply})
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
}
exports.sendreply = async (req, res) => {
    try {
        const { studentName } = req.query;
        const trimmedStudentName = studentName.trim();
        
        // console.log('Trimmed studentName:', trimmedStudentName);

        // Fetch replies based on studentName
        const reply = await Replies.find({ studentName: trimmedStudentName }).exec();
        console.log('Fetched replies:', reply);

        if (reply.length === 0) {
            return res.status(404).json({ message: 'No replies found for the provided student name' });
        }

        // Extract teacher IDs and validate
        const teacherIds = reply.map(data => data.teacherId).filter(id => mongoose.Types.ObjectId.isValid(id));
        // console.log('Teacher IDs:', teacherIds);

        if (teacherIds.length === 0) {
            return res.status(404).json({ message: 'No valid teachers associated with the replies' });
        }

        // Fetch teachers based on teacher IDs
        const teachers = await Teacher.find({ _id: { $in: teacherIds } }).exec();
        // console.log('Fetched teachers:', teachers);

        // Map teacher names
        const namesMap = {};
        teacherIds.forEach(id => namesMap[id.toString()] = []);

        teachers.forEach(teacher => {
            const id = teacher._id.toString();
            if (namesMap[id]) {
                namesMap[id].push(teacher.name);
            }
        });

        const result = teacherIds.flatMap(id => namesMap[id.toString()].map(name => ({ name })));

        res.status(201).json({ message: "Reply Sent Successfully", reply, teachernames: result });
    } catch (error) {
        console.error('Error fetching replies:', error);
        res.status(500).json({ error: error.message });
    }
};