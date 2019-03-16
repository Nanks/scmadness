{
    const test = 'test';
    console.log(test);

    // fs.collection('users').add({
    //     firstName: 'Aaron',
    //     lastName: 'Carr'
    // })
    // .then(function(docRef) {
    //     console.log("Document written with ID: ", docRef.id);
    // })
    // .catch(function(error) {
    //     console.error("Error adding document: ", error);
    // });

    // userRef.get().then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         console.log(doc.data());
    //     });
    // });

    oldTeams.once('value', function(teams) {
        teams.forEach(function(team) {
            console.log(team.key, team.val());
            
        });
    });

    const addAdminRole = fn.httpsCallable('addAdminRole');
    addAdminRole('ta_carr@yahoo.com').then(result => {
        console.log(result);
    });
}