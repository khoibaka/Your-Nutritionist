import React, { Component } from "react";
import "./MediaInput.scss";
import { Button, Row, Col } from "react-bootstrap";
import ReactPlayer from "react-player";
class MediaInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            media: null,
            file: null,
            url: "",
        };
    }

    componentDidMount() {
        console.log(this.props);
        this.setState({
            media: this.props.media,
            url: "",
            file: this.props.file,
        });
    }

    submitFile = (event, type) => {
        var getImagePath = URL.createObjectURL(event.target.files[0]);
        if (event.target.files && event.target.files.length) {
            this.setState({
                media: {
                    type: type,
                    url: getImagePath,
                },
                file: event.target.files[0],
                editing: false,
            });
        }
    };

    submitUrl = (type) => {
        this.setState({
            media: {
                type: type,
                url: this.state.url,
            },
            editing: false,
        });
    };
    goBackToChooseFile = () => {
        this.setState({ media: null, file: null });
    };

    urlChange = (event) => {
        this.setState({ url: event.target.value });
    };

    activeToComponent = (active) => {
        switch (active) {
            case 0:
                return (
                    <div className="media-input-wrapper">
                        <input type="text" className="media-input-field" value={this.state.url} onChange={this.urlChange} />
                        <Button
                            className="form-btn form-submit-btn"
                            onClick={() => {
                                this.submitUrl(0);
                            }}
                        >
                            <span class="material-icons">check</span>
                        </Button>
                    </div>
                );

            case 1:
                return (
                    <input
                        type="file"
                        className="media-input-field"
                        onChange={(event) => {
                            this.submitFile(event, 1);
                        }}
                        accept="image/x-png,image/gif,image/jpeg"
                    />
                );

            case 2:
                return (
                    <div className="media-input-wrapper">
                        <input type="text" className="media-input-field" value={this.state.url} onChange={this.urlChange} />
                        <Button
                            className="form-btn form-submit-btn"
                            onClick={() => {
                                this.submitUrl(2);
                            }}
                        >
                            <span class="material-icons">check</span>
                        </Button>
                    </div>
                );

            case 3:
                return (
                    <input
                        type="file"
                        className="media-input-field"
                        onChange={(event) => {
                            this.submitFile(event, 3);
                        }}
                        accept="video/mp4,video/m4v"
                    />
                );
        }
    };

    render() {
        return (
            <div className="media-input-wrapper">
                {this.state.media ? (
                    <MediaPreviewBig
                        addMedia={() => {
                            this.props.addMedia(this.state.media, this.state.file);
                        }}
                        media={this.state.media}
                        goBackToChooseFile={this.goBackToChooseFile}
                    />
                ) : (
                    this.activeToComponent(this.props.active)
                )}
            </div>
        );
    }
}

const MediaPreviewBig = (props) => {
    return (
        <>
            {props.media.type == 0 || props.media.type == 1 ? (
                <div className="image-preview-big" style={{ backgroundImage: "url('" + props.media.url + "')" }}></div>
            ) : (
                <div className="video-preview-big">
                    <ReactPlayer url={props.media.url} height="100%" width="100%" controls={true} />
                </div>
            )}
            <Row className="media-input-btn-wrapper">
                <Col>
                    <Button className="register-btn register-cancel" onClick={props.goBackToChooseFile}>
                        <span class="material-icons">close</span>
                    </Button>
                </Col>
                <Col>
                    <Button className="register-btn register-submit" onClick={props.addMedia}>
                        <span class="material-icons">check</span>
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default MediaInput;
