import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Link } from 'react-router-dom'
import ReactStars from 'react-rating-stars-component'

import { getUserId } from '../lib/auth'

const user = (props) => {

  const [folder, updateFolder] = useState([])
  const id = props.match.params.id
  const token = localStorage.getItem('token')
  const user = getUserId()

  useEffect(() => {
    axios.get(`/api/folders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        console.log(resp.data)
        updateFolder(resp.data)
      })
  }, [])


  function folderDelete() {
    axios.delete(`/api/folders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        props.history.push(`/user/${user}`)
      })
  }

  function removeFromFolder(placeId) {
    axios.delete(`/api/folders/${id}/${placeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        console.log('deleted')
        updateFolder(resp.data)
      })
  }




  if (folder.name === undefined) {
    return <>

    </>
  }

  return <>
    <div className="single-folder-page">
      <div className="top-half">
        <h1 className="name">{folder.name}</h1>
        <p className="user-name">{`User: ${folder.users[0].username}`}</p>
        <p className="user-time">{`Created: ${moment(folder.created_at).fromNow()}`}</p>
        <p className="folder-count">{folder.places.length !== 0 ? (`Contains: ${folder.places.length} places`) : ('Folder is empty')}</p>
        <Link to={`/user/${user}`}><button id="button-1" className="button is-black">Back</button></Link>
        <button id="button-2" className="button is-danger" onClick={folderDelete}>Delete Folder</button>
      </div>
      <div className="bottom-half">
        <div className="columns is-multiline is-mobile" style={{ display: 'flex', justifyContent: 'center' }}>
          {folder.places.map((place, index) => {
            return <div className="column is-2-desktop is-6-tablet is-12-mobile" key={index}>

              <div className="card">
                <Link to={`/places/${place.id}`}>
                  <div className="card-image">
                    <figure className="image is-square">
                      <img src={place.picture} alt={place.name} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="media-content">
                      <h2 className="title is-5">{place.name}</h2>
                      <ReactStars value={(place.score) / 2} count={5} size={15} activeColor="#ffd700" edit={false} isHalf={true} style={{ alignSelf: 'center' }} />
                    </div>
                  </div>
                </Link>
                <footer className="car-footer">
                  <a className="card-footer-item" onClick={() => removeFromFolder(place.id)}>Remove</a>
                </footer>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
  </>
}




export default user