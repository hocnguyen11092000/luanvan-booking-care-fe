import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DetailSpecialty.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getDetailSpecialtyById,
  getAllCodeService,
} from "../../../services/userService";
import _ from "lodash";
import { LANGUAGES } from "../../../utils";
import LoadingDetail from "../../../components/loading-detail/LoadingDetail";
import LoadingOverlay from "react-loading-overlay";

class DetailSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingDetail: false,
      arrDoctorId: [],
      dataDetailSpecialty: [],
      listProvince: [],
    };
  }
  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;

      try {
        this.setState({ loadingDetail: true });

        let res = await getDetailSpecialtyById({
          id: id,
          location: "ALL",
        });

        let resProvince = await getAllCodeService("PROVINCE");
        console.log("check res >>>>>>>>>>");
        if (
          res &&
          res.errCode === 0 &&
          resProvince &&
          resProvince.errCode === 0
        ) {
          let data = res.data;
          let arrDoctorId = [];
          if (data && !_.isEmpty(res.data)) {
            let arr = data.doctorSpecialty;
            if (arr && arr.length > 0) {
              arr.map((item) => {
                arrDoctorId.push(item.doctorId);
              });
            }
          }
          let dataProvince = resProvince.data;
          let result = [];
          if (dataProvince && dataProvince.length > 0) {
            dataProvince.unshift({
              createAt: null,
              keyMap: "ALL",
              type: "PROVINCE",
              valueEn: "ALL",
              valueVi: "Toàn Quốc",
            });
          }

          this.setState({
            dataDetailSpecialty: res.data,
            arrDoctorId: arrDoctorId,
            listProvince: dataProvince ? dataProvince : [],
          });

          this.setState({ loadingDetail: false });
        }
      } catch (error) {
        console.log(error);
        this.setState({ loadingDetail: false });
      }
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  handleOnChangeSelect = async (event) => {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let location = event.target.value;

      let res = await getDetailSpecialtyById({
        id: id,
        location: location,
      });

      console.log("check res >>>>>>>>>>");
      if (res && res.errCode === 0) {
        let data = res.data;
        let arrDoctorId = [];
        if (data && !_.isEmpty(res.data)) {
          let arr = data.doctorSpecialty;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }
        this.setState({
          dataDetailSpecialty: res.data,
          arrDoctorId: arrDoctorId,
        });
      }
    }
  };
  render() {
    let { arrDoctorId, dataDetailSpecialty, listProvince } = this.state;
    console.log("check state >>>>>>>>>>", this.state);
    let { language } = this.props;

    return (
      <div className="detail-specialty-container">
        <HomeHeader />
        <LoadingOverlay
          active={this.state.loadingDetail}
          spinner
          text="Loading.."
        >
          {!this.state.loadingDetail && (
            <div className="detailSpecialty-body">
              <div className="descriptionSpecialty">
                {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: dataDetailSpecialty.descriptionHTML,
                    }}
                  ></div>
                )}
              </div>

              <div className="search-sp-doctor">
                <select onChange={(event) => this.handleOnChangeSelect(event)}>
                  {listProvince && listProvince.length > 0 ? (
                    listProvince.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })
                  ) : (
                    <div style={{ margin: "20px 0", textAlign: "center" }}>
                      Không tìm thấy kết quả
                    </div>
                  )}
                </select>
              </div>

              {arrDoctorId && arrDoctorId.length > 0 ? (
                arrDoctorId.map((item, index) => {
                  return (
                    <div className="each-doctor" key={index}>
                      <div className="dt-content-left">
                        <div className="profile-doctor">
                          <ProfileDoctor
                            doctorId={item}
                            isShowDescriptionDoctor={true}
                            isShowLinkDetail={true}
                            isShowPrice={false}
                            //dataTime={dataTime}
                          />
                        </div>
                      </div>
                      <div className="dt-content-right">
                        <div className="doctor-schedule">
                          <DoctorSchedule doctorIdFromParent={item} />
                        </div>
                        <div className="doctor-infor">
                          <DoctorExtraInfor doctorIdFromParent={item} />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ margin: "20px 0", textAlign: "center" }}>
                  Không tìm thấy kết quả
                </div>
              )}
            </div>
          )}
        </LoadingOverlay>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
