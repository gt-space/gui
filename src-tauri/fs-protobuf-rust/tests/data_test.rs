use fs_protobuf_rust::compiled::mcfs::data;
use fs_protobuf_rust::compiled::mcfs::board;
use fs_protobuf_rust::compiled::google::protobuf::Timestamp;
use quick_protobuf::{serialize_into_vec, deserialize_from_slice};
use std::borrow::Cow;


#[test]
fn integer_data_serialization() {
    let channel1 = board::ChannelIdentifier {board_id: 10, channel_type: board::ChannelType::GPIO, channel: 0};
    let channel2 = board::ChannelIdentifier {board_id: 10, channel_type: board::ChannelType::GPIO, channel: 1};
    let micros_offsets = vec![0, 10, 20, 30, 40];
    let data1 = data::I32Array {data: vec![0, 1, 2, 3, 4]};
    let data2 = data::I32Array {data: vec![374, 23745, 23842, 243, 98]};

    let integer_data_1 = data::ChannelData {
        channel: Some(channel1),
        timestamp: Some(Timestamp { seconds: 9, nanos: 100 }),
        micros_offsets: micros_offsets.clone(),
        data_points: data::mod_ChannelData::OneOfdata_points::i32_array(data1)
    };

    let integer_data_2 = data::ChannelData {
        channel: Some(channel2),
        timestamp: Some(Timestamp { seconds: 10, nanos: 100 }),
        micros_offsets: micros_offsets.clone(),
        data_points: data::mod_ChannelData::OneOfdata_points::i32_array(data2)
    };

    let data = data::Data {
        channel_data: vec![integer_data_1, integer_data_2]
    };

    let data_serialized = serialize_into_vec(&data).expect("Cannot serialize `data`");
    let data_deserialized: data::Data = deserialize_from_slice(&data_serialized).expect("Cannot deserialize node");

    assert_eq!(data_deserialized.channel_data.len(), 2);

    if let Some(node) = &data_deserialized.channel_data[0].channel {
        assert_eq!(node.channel_type, board::ChannelType::GPIO);
        assert_eq!(node.channel, 0);
    } else {
        panic!("No node identifier given");
    }

    if let Some(node) = &data_deserialized.channel_data[1].channel {
        assert_eq!(node.channel_type, board::ChannelType::GPIO);
        assert_eq!(node.channel, 1);
    } else {
        panic!("No node identifier given");
    }

    if let data::mod_ChannelData::OneOfdata_points::i32_array(data_points) = &data_deserialized.channel_data[1].data_points {
        assert_eq!(data_points.data[0], 374);
    } else {
        panic!("Not the correct data type");
    }
}


#[test]
fn float_data_serialization() {
    let channel1 = board::ChannelIdentifier {board_id: 10, channel_type: board::ChannelType::GPIO, channel: 0};
    let channel2 = board::ChannelIdentifier {board_id: 10, channel_type: board::ChannelType::GPIO, channel: 1};
    let micros_offsets = vec![0, 10, 20, 30, 40];
    let data1 = data::F32Array {data: Cow::from(vec![20.35, 0.1, 28.3, 0.0, 0.0])};
    let data2 = data::F32Array {data: Cow::from(vec![20.35, 0.1, 28.3, 0.0, 0.0])};

    let integer_data_1 = data::ChannelData {
        channel: Some(channel1),
        timestamp: Some(Timestamp { seconds: 10, nanos: 100 }), 
        micros_offsets: micros_offsets.clone(),
        data_points: data::mod_ChannelData::OneOfdata_points::f32_array(data1)
    };

    let integer_data_2 = data::ChannelData {
        channel: Some(channel2),
        timestamp: Some(Timestamp { seconds: 10, nanos: 100 }),
        micros_offsets: micros_offsets.clone(),
        data_points: data::mod_ChannelData::OneOfdata_points::f32_array(data2)
    };

    let data = data::Data {
        channel_data: vec![integer_data_1, integer_data_2]
    };

    let data_serialized = serialize_into_vec(&data).expect("Cannot serialize `data`");
    let data_deserialized: data::Data = deserialize_from_slice(&data_serialized).expect("Cannot deserialize node");

    assert_eq!(data_deserialized.channel_data.len(), 2);

    if let Some(node) = &data_deserialized.channel_data[0].channel {
        assert_eq!(node.channel_type, board::ChannelType::GPIO);
        assert_eq!(node.channel, 0);
    } else {
        panic!("No node identifier given");
    }

    if let Some(node) = &data_deserialized.channel_data[1].channel {
        assert_eq!(node.channel_type, board::ChannelType::GPIO);
        assert_eq!(node.channel, 1);
    } else {
        panic!("No node identifier given");
    }

    if let data::mod_ChannelData::OneOfdata_points::f32_array(data_points) = &data_deserialized.channel_data[1].data_points {
        assert_eq!(data_points.data[0], 20.35);
    } else {
        panic!("Not the correct data type");
    }
}