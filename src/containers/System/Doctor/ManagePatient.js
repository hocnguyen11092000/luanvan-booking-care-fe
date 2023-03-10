import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedDate, FormattedMessage } from 'react-intl';
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientForDoctor, postSendRemedy } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false


        }
    }
    async componentDidMount() {

        this.getDataPatient()
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }


    }

    hanldeOnchangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {

            await this.getDataPatient()
        })

    }



    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();
        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formatedDate
        })
        console.log('>>>>>>>>>>>>>>>>>> ', res);

        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })

        }

    }
    handleBtnConfirm = (item) => {
        console.log('check btn ', item)

        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName


        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
        console.log('check data >>>>>>>>>', data)


    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })

    }

    sendRemedy = async (dataChildModal) => {
        let { dataModal } = this.state;
        this.setState({
            isShowLoading: true,
        })
        let res = await postSendRemedy({
            email: dataChildModal.email,
            imgBase64: dataChildModal.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName



        })

        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false,
            })
            toast.success('Send remedy succeed!');
            this.closeRemedyModal();
            await this.getDataPatient()


        } else {
            toast.error('Send remedy error!')

        }
    }

    render() {
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        let language = this.props;

        console.log('check props: ', this.props)


        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading ...'
                >

                    <div className='manage-patient-container'>
                        <div className='m-p-title'>
                            Quản lý bệnh nhân đặt lịch khám bệnh
                        </div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label>Chọn ngày khám</label>
                                <DatePicker
                                    onChange={this.hanldeOnchangeDatePicker}
                                    className="form-control"
                                    value={this.state.currentDate}


                                />

                            </div>
                            <div className='col-12 table-manage-patient'>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thời gian</th>
                                            <th>Họ và Tên</th>
                                            <th>Địa chỉ</th>

                                            <th>Giới tính</th>
                                            <th>Hành động</th>
                                        </tr>
                                        {dataPatient && dataPatient.length > 0 ?
                                            dataPatient.map((item, index) => {
                                                let time = language === LANGUAGES.VI ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn;
                                                let gender = language === LANGUAGES.VI ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{time}</td>
                                                        <td>{item.patientData.firstName}</td>
                                                        <td>{item.patientData.address}</td>
                                                        <td>{gender}</td>

                                                        <td>
                                                            <button className='mp-btn-confirm'
                                                                onClick={() => this.handleBtnConfirm(item)}
                                                            >
                                                                Xác nhận
                                                            </button>


                                                        </td>



                                                    </tr>
                                                )
                                            })

                                            : <tr>
                                                <td colSpan="6" style={{ textAlign: "center" }}> No data</td>

                                            </tr>


                                        }

                                    </tbody>
                                </table>

                            </div>
                        </div>

                    </div >
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}




                    />
                </LoadingOverlay>

            </>
        );
    }
}

const mapStateToProps = state => {
    return {

        language: state.app.language,
        user: state.user.userInfo

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
