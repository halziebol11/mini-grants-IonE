const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const bcrypt = require('bcryptjs');

//GET all grant data
router.get('/', (req, res) => {
    if(req.isAuthenticated()) {
        let queryText = 'SELECT * from "grant_data";';
        console.log('Fetching all grant data')
        pool.query(queryText)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log(`Error fetching all grant data`, error);
            res.sendStatus(500);
        });
    }
}); //end GET


// GET all reviewers --HALEIGH
router.get('/reviewers', (req, res) => {
    if(req.isAuthenticated()) {
        let queryText = 'SELECT * from "reviewers";';
        console.log('Fetching all reviewers')
        pool.query(queryText)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log(`Error fetching all reviewers`, error);
            res.sendStatus(500);
        });
    }
}); //end GET


//GET unreviewed grants --HALEIGH, need to test all my routes with data
router.get('/unreviewed', (req, res) => {
    console.log('Fetching all unreviewed grants')
    if(req.isAuthenticated()) {
    let queryText = `SELECT COUNT(DISTINCT g.id) as "reviews", g.*
                    FROM grants_data g
                    JOIN scores s
                    ON g.id = s.grant_id
                    WHERE review_complete = TRUE;`;
    pool.query(queryText)
    .then(result => {
        res.send(result.rows);
    })
    .catch(error => {
        console.log(`Error fetching unreviewed grants`, error);
        res.sendStatus(500);
    });
  } else {
    res.sendStatus(401);
  }
}); //end GET

//GET grants for a given reviewer --HALEIGH
router.get('/reviewerGrants', (req, res) => {
    console.log(`Fetching grants for user id: ${req.user.id}`)
    if(req.isAuthenticated()) {
        let queryText1 = `SELECT c.id
                        FROM grant_cycle c
                        WHERE "cycle_complete" = FALSE
                        ORDER by c.start_date;`;
        let cycleID = 0;
        pool.query(queryText1, [userID])
        .then(result => {
        cycleID = result.rows[0]
        })
        .catch(error => {
        console.log(`Error fetching current cycle ID for reviewer`, error);
        res.sendStatus(500);
        });
        const userID = req.user.id;
        let queryText2 = `SELECT d.*, s.* 
                        FROM grant_assignments a
                        JOIN grant_data d
                        ON a.grant_id = d.id
                        FULL JOIN scores s
                        ON a.grant_id = s.grant_id
                        WHERE a.reviewer_id = $1
                        AND a.cycle_id = $2`;
        pool.query(queryText2, [userID, cycleID])
        .then(result => {
        res.send(result.rows);
        })
        .catch(error => {
        console.log(`Error fetching grants for user id: ${req.user.id}`, error);
        res.sendStatus(500);
        });
    } else {
        res.sendStatus(401);
    }
}); //end GET


//POST to save grant data (interacts with google sheet) --RILEY
router.post('/',  (req, res) => {
    if(req.isAuthenticated()) {

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        let queryText = `INSERT INTO "grant_data" 
                        ("cycle_id", "time_stamp", "dept_id", "applicant_name", "applicant_email", "abstract", "proposal_narrative", "project_title", "principal_investigator",
                            "letter_of_support", "PI_email", "PI_employee_id", "PI_primay_college", "PI_primary_campus", "PI_dept_accountant_name", 
                            "PI_dept_accountant_email", "additional_team_members", "funding_type", "budget_items", "new_endeavor", "heard_from_reference",
                            "total_requested_budget")
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22);`;
        
        //Package raw data submitted from the grant application google form to be inserted into postgres database
        const dataObj = {
            cycle_id: req.body.cycle_id,
            time_stamp: Date.now(),
            dept_id: req.body.dept_id, //Array
            applicant_name: req.body.applicant_name,
            applicant_email: req.body.applicant_email,
            abstract: req.body.abstract,
            proposal_narrative: req.body.proposal_narrative,
            project_title: req.body.project_title,
            principal_investigator: req.body.principal_investigator,
            letter_of_support: req.body.letter_of_support, //URL link
            PI_email: req.body.PI_email,
            PI_employee_id: bcrypt.hashSync(req.body.PI_employee_id, salt), //employee ID will be salted
            PI_primary_college: req.body.PI_primary_college,
            PI_primary_campus: req.body.PI_primary_campus,
            PI_dept_accountant_name: req.body.PI_dept_accountant_name,
            PI_dept_accountant_email: req.body.PI_dept_accountant_email,
            additional_team_members: req.body.additional_team_members,
            funding_type: req.body.funding_type,
            budget_items: req.body.budget_items,
            new_endeavor: req.body.new_endeavor,
            heard_from_reference: req.body.heard_from_reference,
            total_requested_budget: req.body.total_requested_budget
        }

        pool.query(queryText, [ dataObj ])
        .then(result => {
        res.sendStatus(201);
        })
        .catch(error => {
        console.log(`Error running query ${queryText}`, error);
        res.sendStatus(500);
        });
    } else {
        res.sendStatus(401);
    }
});//end POST


// PUT to finalize review cycle --RILEY
router.put('/finalizeCycle', (req, res) => {
  
  if (req.isAuthenticated()) {
    console.log(req.body);
    let cycle_name = req.body.cycle_name;
    let queryText = `UPDATE "grant_cycle" 
                    SET "cycle_complete" = TRUE 
                    WHERE "cycle_name" = $1;`;
    pool.query(queryText, [cycle_name])
    .then((result) =>{
        console.log('Success', cycle_name);
        res.sendStatus(200);
    })
    .catch((err) => {
        console.log(`Error making query ${queryText}`, err);
        res.sendStatus(500)
    })
  } else {
    res.sendStatus(401);
  }
}
)// end PUT

// PUT to set scores as reviewer --RILEY
router.post('/setScores', (req, res) => {

    if (req.isAuthenticated()) {

        //Get data from request and set to variables
        let grant_id = req.body.grant_id;
        let reviewer_id = req.body.reviewer_id;
        let score_id = null;
        const created_at = req.body.created_at;
        const assigned_by = req.body.assigned_by;
        const interdisciplinary = req.body.interdisciplinary;
        const goals = req.body.goals;
        const method_and_design = req.body.method_and_design;
        const budget = req.body.budget;
        const impact = req.body.impact;
        const review_complete = req.body.review_complete;

        //Check if scores have already been saved for this grant and reviewer combination
        let queryText = `SELECT "id" FROM "scores"
                        WHERE "grant_id" = $1 AND "reviewer_id" = $2;`;

        pool.query(queryText, [grant_id, reviewer_id])
            .then((result) => {
                //If the scores  have been saved update them with the new values
                if (result.rowCount > 0) {
                    score_id = result.rows[0].id;
                    console.log('Score Id:', score_id);
                    queryText = `UPDATE "scores"
                SET "created_at" = $1,
                    "interdisciplinary" = $2,
                    "goals" = $3,
                    "method_and_design" = $4,
                    "budget" = $5,
                    "impact" = $6
                WHERE "id" = $7;`;

                    pool.query(queryText, [created_at, interdisciplinary, goals, method_and_design, budget, impact, score_id])
                        .then((response) => {
                            res.sendStatus(201);
                        }).catch((error) => {
                            console.log(`error making query ${queryText}`);
                            res.sendStatus(500);
                        });
                } else if (rowCount === 0) {
                    //if these are new scores create a new database line
                    queryText = `INSERT INTO "scores" (
                                "created_at", 
                                "grant_id", 
                                "reviewer_id", 
                                "assigned_by", 
                                "interdisciplinary", 
                                "goals",
                                "method_and_design",
                                "budget",
                                "impact")
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;

                    pool.query(queryText, [created_at, grant_id, reviewer_id, assigned_by, interdisciplinary, goals, method_and_design, budget, impact])
                        .then((response) => {
                            res.sendStatus(201);
                        }).catch((error) => {
                            console.log(`error making query ${queryText}`);
                            res.sendStatus(500);
                        })
                }
            })
            //Catch from first query
            .catch((err) => {
                console.log(`Error making query ${queryText}`, err);
                res.sendStatus(500)
            });



    } else {
        res.sendStatus(401);
    }
})// end PUT

// PUT to set review as complete --HALEIGH
router.put('/complete/:id', (req, res) => {
    let id = req.params.id;
    console.log('Setting review complete, review id:', id);
    if (req.isAuthenticated()) {
      let queryText = `UPDATE "scores" 
                    SET "review_complete" = TRUE
                    WHERE "id" = $1;`;
      pool.query(queryText, [id])
      .then((result) =>{
          res.sendStatus(200);
      })
      .catch((err) => {
          console.log(`Error setting review complete`, err);
          res.sendStatus(500)
      })
    } else {
      res.sendStatus(401);
    }
})// end PUT

//GET to generate list of available grants to review
router.get('/availableReviews', (req, res) => {

    if(req.isAuthenticated()) {
        console.log(req.body);
        console.log('Fetching available grants')
        let reviewerID = req.body.reviewerID;
        let reviews = req.body.reviews;
        let cycleID = req.body.cycleID;
        let available = []
        let queryText = `SELECT d.id, COUNT(*)
                      FROM "grant_data" d
                      FULL JOIN "grant_assignments" a
                      ON d.id = a.grant_id
                      WHERE "cycle_id" = $1
                      GROUP BY d.id
                      ORDER BY RANDOM()
                      HAVING COUNT(*) < 3;`;
                      //	Randomize list of grants from server that have less than 3 reviewers assigned
        pool.query(queryText, [cycleID])
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log(`Error fetching grants available to review`, error);
            res.sendStatus(500);
        });
    }
}); //end GET


//POST to assign grant reviews to reviewer (put in for loop)
router.post('/assign', (req, res) => {

    if (req.isAuthenticated()) {
      console.log(req.body);
      let reviewerID = req.body.reviewerID;
      let reviews = req.body.reviews;
      let cycleID = req.body.cycleID;
      let available = req.body.available
      let queryText = `SELECT d.id, COUNT(*)
                    FROM "grant_data" d
                    FULL JOIN "grant_assignments" a
                    ON d.id = a.grant_id
                    WHERE "cycle_id" = $1
                    GROUP BY d.id
                    ORDER BY RANDOM()
                    HAVING COUNT(*) < 3;`;
                    //	Randomize list of grants from server that have less than 3 reviewers assigned
      pool.query(queryText, [cycleID])
      .then((result) =>{
          console.log('Success', cycle_name);
          res.sendStatus(200);
      })
      .catch((err) => {
          console.log(`Error making query ${queryText}`, err);
          res.sendStatus(500)
      })
    } else {
      res.sendStatus(401);
    }
  }
  )// end POST


module.exports = router;