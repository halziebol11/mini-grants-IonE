// View 3.3 Reviewer View

// React
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

// Axios
import axios from 'axios';

// Styles
import './GrantReviewForm.css'

function GrantReviewForm() {

    const history = useHistory();

    const [interdisciplinary, setInterdisciplinary] = useState(null);
    const [goals, setGoals] = useState(null);
    const [method_and_design, setMethod_and_design] = useState(null);
    const [budget, setBudget] = useState(null);
    const [impact, setImpact] = useState(1);
    const [recommendation, setRecommendation] = useState(null);
    const [comments, setComments] = useState(null);

    const interdisciplinaryRadioChange = (event) => {
        setInterdisciplinary(+event.target.id);
    };
    console.log(interdisciplinary);

    const goalsRadioChange = (event) => {
        setGoals(+event.target.id);
    };
    console.log(goals);
    
    const method_and_designRadioChange = (event) => {
        setMethod_and_design(+event.target.id);
    };
    console.log(method_and_design);

    const budgetRadioChange = (event) => {
        setBudget(+event.target.id);
    };
    console.log(budget);
    
    const recommendationRadioChange = (event) => {
        setRecommendation(+event.target.id);
    };
    console.log(recommendation);

    let submittedScores = {
        created_at: "11-27-2023 1:03pm",
        grant_id: 1,
        reviewer_id: 1,
        assigned_by: 1,
        interdisciplinary: interdisciplinary,
        goals: goals,
        method_and_design: method_and_design,
        budget: budget,
        impact: impact,
        review_complete: true,
    };

    let savedScores = {
        created_at: "11-27-2023 1:03pm",
        grant_id: 1,
        reviewer_id: 1,
        assigned_by: 1,
        interdisciplinary: interdisciplinary,
        goals: goals,
        method_and_design: method_and_design,
        budget: budget,
        impact: impact,
        review_complete: false,
    };

    const saveScores = () => {
        console.log(savedScores);
        axios.post(`/grants/setScores`, savedScores)
            .then((response) => {
                console.log(savedScores);
            }).catch((error) => {
                console.log(error);
                alert('Something went wrong.');
            });
        // history.push(`/reviewerhomepage`);
    };

    const submitScores = () => {
        console.log(submittedScores);
        axios.post(`/grants/setScores`, submittedScores)
            .then((response) => {
                console.log(submittedScores);
            }).catch((error) => {
                console.log(error);
                alert('Something went wrong.');
            });
        history.push(`/reviewerhomepage`);
    };

    return (
        <div id="review-form">
            <br />
            <h4><span>Welcome </span><span>Reviewer</span></h4>
            <p>This form is unique to each reviewer.</p>
            <p>Please use the review guidance criteria in Columns F through L to review the proposals assigned for your review in Column E.</p>
            
            <h4>Project PI: </h4>
                <p>PI Name</p>
            <h4>Project Title:</h4>
                <p>Project Title</p>
            
            <p className='review-form-title'></p>

            <table>
                <tr>
                    <th>Interdisciplinary Collaboration</th>
                </tr>
                <tr>
                    <td>
                        5 pts - This proposal includes both individuals from the university and
                        external (non-university) collaborators that represent an exemplary
                        variety of disciplines, expertise, and ways of knowing. Examples would
                        include a combination of participants or perspectives including (but not
                        limited to) STEM and/or social scientists, humanities scholars, artists,
                        community experts, industry experts, and/or policy experts.
                    </td>
                </tr>
                <tr>
                    <td>
                        3 pts - This proposal includes individuals from within the university as
                        well as external (non-university) stakeholders or experts, each of whom
                        add well-articulated value to the project. Partners represent different
                        units/departments or fields of expertise, but those units, departments, or
                        forms of expertise are closely related.
                    </td>
                </tr>
                <tr>
                    <td>
                        2 pts - This proposal includes individuals from the university from
                        different departments, units, organizations, and/or affiliations (faculty,
                        staff, students), each of whom add value to the project. The project is
                        interdisciplinary, but does not appear to have non-university partners.
                    </td>
                </tr>
                <tr id="second-to-last">
                    <td>
                        1 pt - This proposal appears to be interdisciplinary based on team
                        members' affiliation, but one or more of the partners' roles is poorly
                        defined or does not appear to add value.
                    </td>
                </tr>
                <tr id="last">
                    <td>
                        0 pts - This proposal does not appear to be interdisciplinary; only one unit
                        or discipline is represented, and no external partners are present.
                    </td>
                </tr>
            </table>
            <form>
                <input type="radio" id="1" name="interdisciplinary" value={interdisciplinary} onChange={interdisciplinaryRadioChange}/>
                <label for="interdisciplinary">0</label>
                <input type="radio" id="1" name="interdisciplinary" value={interdisciplinary} onChange={interdisciplinaryRadioChange}/>
                <label for="interdisciplinary">1</label>
                <input type="radio" id="2" name="interdisciplinary" value={interdisciplinary} onChange={interdisciplinaryRadioChange}/>
                <label for="interdisciplinary">2</label>
                <input type="radio" id="3" name="interdisciplinary" value={interdisciplinary} onChange={interdisciplinaryRadioChange}/>
                <label for="interdisciplinary">3</label>
                <input type="radio" id="4" name="interdisciplinary" value={interdisciplinary} onChange={interdisciplinaryRadioChange}/>
                <label for="interdisciplinary">4</label>
                <input type="radio" id="5" name="interdisciplinary" value={interdisciplinary} onChange={interdisciplinaryRadioChange}/>
                <label for="interdisciplinary">5</label>
            </form>

            <p className='review-form-title'>Project Goals</p>
            <form>
                <input type="radio" id="1" name="goals" value={goals} onChange={goalsRadioChange}/>
                <label for="goals">1</label>
                <input type="radio" id="2" name="goals" value={goals} onChange={goalsRadioChange}/>
                <label for="goals">2</label>
                <input type="radio" id="3" name="goals" value={goals} onChange={goalsRadioChange}/>
                <label for="goals">3</label>
                <input type="radio" id="4" name="goals" value={goals} onChange={goalsRadioChange}/>
                <label for="goals">4</label>
                <input type="radio" id="5" name="goals" value={goals} onChange={goalsRadioChange}/>
                <label for="goals">5</label>
            </form>

            <p className='review-form-title'>Method/Design</p>
            <form>
                <input type="radio" id="0" name="method_and_design" value="method_and_design" onChange={method_and_designRadioChange}/>
                <label for="method_and_design">0</label>
                <input type="radio" id="2" name="method_and_design" value="method_and_design" onChange={method_and_designRadioChange}/>
                <label for="method_and_design">2</label>
                <input type="radio" id="3" name="method_and_design" value="method_and_design" onChange={method_and_designRadioChange}/>
                <label for="method_and_design">3</label>
                <input type="radio" id="5" name="method_and_design" value="method_and_design" onChange={method_and_designRadioChange}/>
                <label for="method_and_design">5</label>
            </form>

            <p className='review-form-title'>Budget</p>
            <form>
                <input type="radio" id="0" name="budget" value="budget" onChange={budgetRadioChange}/>
                <label for="budget">0</label>
                <input type="radio" id="0.5" name="budget" value="budget" onChange={budgetRadioChange}/>
                <label for="budget">0.5</label>
                <input type="radio" id="1" name="budget" value="budget" onChange={budgetRadioChange}/>
                <label for="budget">1</label>
                <input type="radio" id="2" name="budget" value="budget" onChange={budgetRadioChange}/>
                <label for="budget">2</label>
            </form>

            {/* Have to figure out how to add these up */}
            <p className='review-form-title'>Impact</p>
            <form>
                <input type="checkbox" id="2" name="impact" value="impact" />
                <label for="impact">2</label>
                <input type="checkbox" id="2" name="impact" value="impact" />
                <label for="impact">2</label>
                <input type="checkbox" id="2" name="impact" value="impact" />
                <label for="impact">2</label>
            </form>

            <p className='review-form-title'>Final Recommendation</p>
            <form>
                <input type="radio" id="0" name="recommendation" value={recommendation} onChange={recommendationRadioChange}/>
                <label for="recommendation">0</label>
                <input type="radio" id="2" name="recommendation" value={recommendation} onChange={recommendationRadioChange}/>
                <label for="recommendation">2</label>
                <input type="radio" id="3" name="recommendation" value={recommendation} onChange={recommendationRadioChange}/>
                <label for="recommendation">3</label>
            </form>

            <p className='review-form-title'>Comments</p>
                <textarea
                    rows="7"
                    cols="38"
                    placeholder='Enter review comments here'
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                />

            <br />
            <br />

            <button onClick={saveScores}>Save</button> <button onClick={submitScores}>Submit</button>

        </div>
    )
}

export default GrantReviewForm;

// Will go back to Reviewer Home Page 3.2