import React from 'react';

function Search({ onSubmit, query }) {
  const submitHandler = (e) => {
    e.preventDefault();
    const organizationName = e.target[0].value;

    onSubmit(organizationName);
  };

  return (
    <form onSubmit={submitHandler} className="organization-form">
      <label htmlFor="organizationName">Organization</label>
      <input type="text" id="organizationName" defaultValue={query} />
      <button type="submit">Get Data</button>
    </form>
  )
}

export default Search;
