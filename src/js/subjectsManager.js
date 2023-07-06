import urlLists from './subjectsList.js';

const subjectsManager = {
    getSubjects: (subject) => {
        const subjects = urlLists[subject] || urlLists['default'];
        return subjects;
    }
};

export default subjectsManager;