import React, { useEffect, useState, useContext, useSyncExternalStore } from "react"
import { usrList, delegationRelationship, delegationCategories, requestDelegationCategories, postDelegation, postRelationship } from "../../functions/delegations"
import logo from '../../assets/img/logo.png'
import TokenContext from "../../functions/TokenContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Delegation.css"
import { useNavigate } from "react-router-dom";

const CreateDelegation = () => {
    // Access token context
    const { tokens } = useContext(TokenContext);
    // Access the navigation functionality
    const navigate = useNavigate();

    // Decide delegationg to a user or a reletionship member
    const [buttonFor2, setButtonFor2] = useState("delegate");
    // Decide if the delegation has an expiration date or not
    const [buttonExpiration, setButtonExpiration] = useState("no");
    // Const to save the expiration date selected
    const [expirationDate, setExpirationDate] = useState("");


    // List of users to delegate for
    const [userDelegations4, setUserDelegations4] = useState([]);
    // List of users selected to delegate for
    const [delegate4, setDelegate4] = useState([]);
    // Filter to fetch a specific user
    const [user4Filter, setUser4Filter] = useState("");


    // List of users to delegate to
    const [userDelegations2, setUserDelegations2] = useState([]);
    // User selected to delegate to
    const [delegate2, setDelegate2] = useState([]);
    // Filter to fetch a specific user
    const [user2Filter, setUser2Filter] = useState("");
    // List of reletionship members to delegate to
    const [delRelation, setDelRelation] = useState([]);
    // Relationship member selected
    const [delRelation2, setDelRelation2] = useState("");


    // Boolen to display delegations categories whene "on"
    const [buttonCategories, setButtonCategories] = useState("off");
    // List of different categoris of delegations
    const [delCategoires, setDelCategories] = useState([]);
    // Filter to fetch the list of delegations out of the category selected
    const [categorySelected, setCategorySelected] = useState("");
    // List of delegations out of the category selected
    const [delCategoriesList, setDelCategoriesList] = useState([]);
    // List of delegations selected 
    const [selectedCategories, setSelectedCategories] = useState([]);

    
    // Trigger to creat the delegation
    const [createDel, setCreateDel] = useState('false');

    const [requestAll, setRequestAll] = useState('false');
    const [colorAll, setColorAll] = useState('false');

    useEffect(() => {
        // Fetch the list of users to delegate for
        if (user4Filter) {
            usrList(user4Filter, tokens.access_token, setUserDelegations4)
        }
    }, [user4Filter, tokens.access_token])

    useEffect(() => {
        // Fetch the list of users to delegate to
        if (user2Filter) {
            usrList(user2Filter, tokens.access_token, setUserDelegations2)
        }
    }, [user2Filter, tokens.access_token])


    useEffect(() => {
        // Fetch the list of relationship members to delegate to
        delegationRelationship(tokens.access_token, setDelRelation)
    }, [tokens.access_token])

    useEffect(() => {
        // Fetch list of categories
        delegationCategories(tokens.access_token, setDelCategories)
    }, [tokens.access_token])

    useEffect(() => {
        // Fetch list of delegations out of the category selected
        if (categorySelected) {
            requestDelegationCategories(categorySelected, tokens.access_token, setDelCategoriesList)
        }
    }, [categorySelected, tokens.access_token])


    // Setting the elements selected to create a delegation for one or more users in a JSON format
    const delegate4JSON = delegate4.map(user => ({ dn: user.dn, name: user.fullName }));
    const delegate2JSON = { dn: delegate2.dn, name: delegate2.fullName };
    const selCat = selectedCategories.map(user => ({ dn: user.dn, name: user.name ? user.name.split(' ')[0] : '' }));

    useEffect(() => {
        // Cheking the boolean to creat the delegation
        if (createDel === "true") {
            // Creating the delegation with expiration date selected
            if (expirationDate != null) {
                const expirationDateStr = Date.parse(expirationDate);
                postDelegation(requestAll,delegate4JSON, delegate2JSON, expirationDateStr, selCat, tokens.access_token, setDelCategoriesList);
                setCreateDel("false");
                navigate('/delegations');
            }
            // Creating the delegation without expiration date selected
            else {
                postDelegation(requestAll,delegate4JSON, delegate2JSON, null, selCat, tokens.access_token, setDelCategoriesList);
                setCreateDel("false");
                navigate('/delegations');
            }
        }
    }, [delegate4JSON, delegate2JSON, selCat, tokens.access_token]);

    // Seting the reletionship selected in a JSON format
    const delRelation2JSON = { key: delRelation2.key };

    useEffect(() => {
        if (createDel === "true") {
            // Creating a relationship delegation with expiration date
            if (expirationDate != null) {
                const expirationDateStr = Date.parse(expirationDate);
                postRelationship(requestAll, delegate4JSON, delRelation2JSON, expirationDateStr, selCat, tokens.access_token, setDelCategoriesList);
                setCreateDel("false");
            }
            // Creating a relationship delegation without expiration date
            else {
                postRelationship(requestAll, delegate4JSON, delRelation2JSON, null, selCat, tokens.access_token, setDelCategoriesList);
                setCreateDel("false");
            }
        }
    }, [requestAll, delegate4JSON, delegate2JSON, selCat, tokens.access_token]);

    // Generate a new list with the users selected out of the users list (userDelegation4)
    function handleDelegate4Click(user) {
        // Check if the user is already selected
        const index = delegate4.findIndex(delegate4 => delegate4.dn === user.dn);
        if (index === -1) {
            // User is not selected yet, add to the array. 
            //...delegate4 create a new array with the same elements as delegate4
            // This step is important to create a new array and avoid directly modifying the existing state array
            setDelegate4([...delegate4, user]); //creates a new array by spreading the existing delegate4 array, and then appends the user object to the end of the new array. 
        } else {
            // User is already selected, remove from the array
            const newDelegate4 = [...delegate4];
            newDelegate4.splice(index, 1);
            setDelegate4(newDelegate4);
        }
    }

    // From the category list displayed, add to selectedCategories the one clicked. 
    const handleCategoryClick = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const delRequestAll = () => {
        setRequestAll(prevState => !prevState);
        setColorAll(prevState => !prevState);
    }


    return (
        <>        
            <div className="header-container">
                <img src={logo} alt="" />
                <h1>Create Delegate Assignment</h1>
            </div>

            <div className="destination-box">
                <div className="categories-container">

                    <div className="request-box">
                        <h4>Delegate for*</h4>
                        <input
                            required
                            type="text"
                            placeholder="Search in users by First Name, Last Name"
                            value={user4Filter}
                            onChange={(e) => setUser4Filter(e.target.value)}
                        />
                    </div>


                    <div className="categories-list" >
                        {userDelegations4 != null ? (
                            <div className="delegation-box">
                                <h4>User list:</h4>
                                <ul>
                                    {userDelegations4.map((user) => (
                                        <li
                                            key={user.id}
                                            onClick={() => handleDelegate4Click(user)}
                                            className={delegate4.findIndex((delegate4) => delegate4.dn === user.dn) !== -1 ? 'selected' : ''}
                                        >
                                            {user.fullName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            'No user found with this name'
                        )}
                    </div>

                    <div className="categories-list" style={{ flex: 1 }}>
                        <div className="delegation-box">
                            <h4>Selected users:</h4>
                            <ul>
                                {delegate4.map((user) => (
                                    <li key={user.id}>{user.fullName}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            <div className="destination-box">
                <div className="request-box">
                    <h4>Delegate to*</h4>
                    <button type="button" className={`${buttonFor2 === "delegate" ? "active" : ""}`} onClick={() => { setButtonFor2("delegate") }}>Assign delegate</button>
                    <button type="button" className={`${buttonFor2 === "relationship" ? "active" : ""}`} onClick={() => { setButtonFor2("relationship") }}>Assign by relationship</button>
                    <input
                        required
                        type="text"
                        placeholder="Search in users by First Name, Last Name"
                        value={user2Filter}
                        onChange={e => setUser2Filter(e.target.value)}
                    />
                </div>

                {buttonFor2 === "delegate" ? (
                    <>
                        {userDelegations2 != null ? (
                            <div className="delegation-box">
                                <h4>Users List:</h4>
                                <ul>
                                    {userDelegations2.map(user => (
                                        <li key={user.id} onClick={() => setDelegate2(user)} style={{ fontWeight: delegate2.dn === user.dn ? 'bold' : 'normal' }}>
                                            {user.fullName}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        ) : ('No user found with this name')}
                        <div className="delegation-box" >{delegate2.fullName}</div>
                    </>
                ) : (
                    <>
                        {delRelation != null ? (
                            <div className="delegation-box" >
                                <h4>Relationships List:</h4>
                                <ul>
                                    {delRelation.map(user => (
                                        <li key={user.id} onClick={() => setDelRelation2(user)}>
                                            {user.displayName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : ('No delegations found')}
                        <div className="delegation-box" >{delRelation2.displayName}</div>
                    </>
                )}
            </div>

            <div className="destination-box">
                <div className="request-box">
                    <h4>Expiration</h4>
                    <button type="button" className={`${buttonExpiration === "no" ? "active" : ""}`} onClick={() => { setButtonExpiration("no"); setExpirationDate(''); }}>No Expiration</button>
                    <button type="button" className={`${buttonExpiration === "specify" ? "active" : ""}`} onClick={() => { setButtonExpiration("specify") }}>Specify Expiration</button>

                    {buttonExpiration === "no" ? (
                        <></>
                    ) : (
                        <>
                            <DatePicker
                                selected={expirationDate}
                                onChange={(date) => setExpirationDate(date)}
                                showTimeSelect
                                dateFormat="Pp"
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="destination-box">
                <div className="request-box">
                    <h4>Request type selection</h4>
                    <button type="button" className={`${buttonCategories === "no" ? "active" : ""}`} onClick={() => { setButtonCategories("on") }}>Request type selection</button>
                    <button type="button" onClick={() => { delRequestAll() }} style={{ backgroundColor: colorAll ? '#0b2578' : 'red' }}>Request All</button>

                </div>
                {buttonCategories === "on" ? (
                    <div className="categories-container" style={{ display: 'flex', flexWrap: 'wrap' }}>

                        <div className="categories-list" style={{ flex: 1 }}>
                            {delCategoires != null ? (
                                <div className="delegation-box" >
                                    <h4>Process request category:</h4>
                                    <ul>
                                        {delCategoires.map(category => (
                                            <li key={category.id} onClick={() => setCategorySelected(category.categoryId)}>
                                                {category.categoryName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : ('')}
                        </div>

                        <div className="categories-list" style={{ flex: 1 }}>
                            {delCategoriesList != null ? (
                                <div className="delegation-box" >
                                    <h4>Available Requests in Selected Category:</h4>
                                    <ul>
                                        {delCategoriesList.map((category) => (
                                            <li
                                                key={category.id}
                                                onClick={() => handleCategoryClick(category)}
                                                className={selectedCategories.includes(category) ? 'selected' : ''}
                                            >
                                                {category.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                'No categories found'
                            )}
                        </div>

                        <div className="categories-list" style={{ flex: 1 }}>
                            {selectedCategories.length > 0 && (
                                <div className="delegation-box" >
                                    <h4>Selected Requests:*</h4>
                                    <ul>
                                        {selectedCategories.map((category) => (
                                            <li key={category.id}>
                                                {category.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                    </div>
                ) : ('')}
            </div>
            <button type="button" onClick={() => { setCreateDel("true") }} disabled={delegate4.length < 1 || delegate2.length < 1 || selectedCategories.length < 1}>Create</button>
            <button type="button" onClick={() => { navigate('/delegations') }}>Cancel</button>
        </>
    )
}
export default CreateDelegation;