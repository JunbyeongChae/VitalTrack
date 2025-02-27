import React from 'react'
import { Link } from 'react-router'

const ReBoardDBItem = (props) => {
    const {B_NO, B_TITLE, MEM_NAME} = props.board
    //console.log(n_title)
    console.log(props.page)    
    return (
        <>
            <tr>
                <td>{B_NO}</td>
                <td>
                {/* <Route path="/notice/:n_no" exact={true} element={<NoticeDetail />}/> */}
                <Link to={`/reboard/${B_NO}?page=${props.page}`} className='btn btn-primary'>{B_TITLE}</Link>
                </td>
                <td>{MEM_NAME}</td>
            </tr>
        </>
    )
}

export default ReBoardDBItem