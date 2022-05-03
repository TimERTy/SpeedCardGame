import styled from 'styled-components'
import heaaderImg from '../../Assets/header.png'

const MenuHeader = () => {
	return <HeaderImg src={heaaderImg} alt={"Speed card game online logo"} />
}

const HeaderImg = styled.img`
	width: 100%;
	margin: -20px 0;
`

export default MenuHeader
