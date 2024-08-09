const Message = require('../Models/Message.cjs');
const User = require('../Models/User.cjs');
const Teacher= require('../Models/Teacher.cjs');

exports.sendMessage = async (req, res) => {
  try {
    const { studentId, teacherId, content,sendAt,time} = req.body;
    const message = new Message({ studentId, teacherId, content,sendAt,time});
    await message.save();
    res.status(201).json({ message: 'Message sent successfully', message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
function convertToIndianDateFormat(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
exports.getMessage = async (req, res) => {
  try {
    const { teacherId } = req.query;

    if (!teacherId) {
      const messages = await Message.find({});
      console.log(messages);

      const detailedMessages = await Promise.all(messages.map(async (msg) => {
        const student = await User.findById(msg.studentId).select('name');
        const studentstat = await User.findById(msg.studentId).select('status');

        return {
          teacherName: (await Teacher.findById(msg.teacherId).select('name')).name || 'Unknown',
          studentName: student ? student.name : 'Unknown',
          studentId: msg.studentId,
          content: msg.content,
          sendAt: convertToIndianDateFormat(msg.sendAt),
          time: msg.time,
          studentstatus: studentstat ? studentstat.status : 'Unknown'
        };
      }));

      return res.status(200).json({ message: 'All messages retrieved successfully', messages: detailedMessages });
    }

    const messages = await Message.find({ teacherId });
    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found for this teacherId' });
    }

    const detailedMessages = await Promise.all(messages.map(async (msg) => {
      const student = await User.findById(msg.studentId).select('name');

      return {
        studentName: student ? student.name : 'Unknown',
        content: msg.content,
        sendAt: convertToIndianDateFormat(msg.sendAt),
        time: msg.time
      };
    }));

    res.status(200).json({ message: 'Messages retrieved successfully', messages: detailedMessages });
  } catch (error) {
    console.error('Error fetching messages:', error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};
