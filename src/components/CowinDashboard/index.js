// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    last7DaysVaccinatioN: [],
    vaccinationByAge: [],
    vaccinationByGender: [],
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const respose = await fetch(url)
    if (respose.ok === true) {
      const data = await respose.json()
      const last7DaysVaccinatioN = data.last_7_days_vaccination.map(each => ({
        vaccineDate: each.vaccine_date,
        dose1: each.dose_1,
        dose2: each.dose_2,
      }))
      const vaccinationByAge = data.vaccination_by_age
      const vaccinationByGender = data.vaccination_by_gender
      console.log(data)
      console.log(vaccinationByGender)

      this.setState({
        apiStatus: apiStatusConstants.success,
        last7DaysVaccinatioN,
        vaccinationByAge,
        vaccinationByGender,
      })
    }
    if (respose.status === 403) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderInprogressView = () => (
    <div className="CowinDashboard-loader-container">
      <div data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
      </div>
    </div>
  )

  renderfailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
    </div>
  )

  rendersuccessView = () => {
    const {last7DaysVaccinatioN, vaccinationByAge} = this.state
    const {vaccinationByGender} = this.state
    console.log(vaccinationByGender)
    console.log(vaccinationByAge)
    return (
      <div>
        <VaccinationCoverage last7DaysVaccinatioN={last7DaysVaccinatioN} />
        <VaccinationByGender vaccinationByGender={vaccinationByGender} />
        <VaccinationByAge vaccinationByAge={vaccinationByAge} />
      </div>
    )
  }

  renderItems = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderInprogressView()
      case apiStatusConstants.failure:
        return this.renderfailureView()
      case apiStatusConstants.success:
        return this.rendersuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="CowinDashboard-bg-container">
        <div className="CowinDashboard-logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="CowinDashboard-logo-img"
          />
          <h1 className="CowinDashboard-logo-heading">co-WIN</h1>
        </div>
        <h1 className="CowinDashboard-heading">CoWIN Vaccination in India</h1>
        {this.renderItems()}
      </div>
    )
  }
}
export default CowinDashboard
